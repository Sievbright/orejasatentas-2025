// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const auth = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, petName, petBreed, petAge } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nombre, email y contraseña son obligatorios." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario registrado con ese email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Si viene una mascota inicial, la creamos asociada al usuario
    if (petName && petBreed) {
      await Pet.create({
        name: petName,
        breed: petBreed,
        age: petAge ? Number(petAge) : undefined,
        owner: user._id,
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error en /auth/register:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Credenciales inválidas (usuario no encontrado)." });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res
        .status(400)
        .json({ error: "Credenciales inválidas (contraseña incorrecta)." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error en /auth/login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/auth/me  (valida token y devuelve user + pets)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const pets = await Pet.find({ owner: req.user.id }).lean();

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      pets,
    });
  } catch (err) {
    console.error("Error en /auth/me:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
