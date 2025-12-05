// backend/routes/petRoutes.js
const express = require("express");
const Pet = require("../models/Pet");
const auth = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de mascotas requieren estar autenticado
router.use(auth);

// GET /api/pets  → lista solo las mascotas del usuario
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).lean();
    res.json(pets);
  } catch (err) {
    console.error("Error en GET /api/pets:", err);
    res.status(500).json({ error: "Error al obtener las mascotas." });
  }
});

// POST /api/pets  → crea una mascota asociada al usuario
router.post("/", async (req, res) => {
  try {
    const { name, breed, age, weight } = req.body || {};

    if (!name || !breed) {
      return res
        .status(400)
        .json({ error: "Nombre y raza son obligatorios." });
    }

    const pet = await Pet.create({
      name,
      breed,
      age: age !== undefined ? Number(age) : undefined,
      weight: weight !== undefined ? Number(weight) : undefined,
      owner: req.user.id,
    });

    res.status(201).json(pet);
  } catch (err) {
    console.error("Error en POST /api/pets:", err);
    res.status(500).json({ error: "Error al crear la mascota." });
  }
});

// DELETE /api/pets/:id  → elimina mascota SOLO si es del usuario
router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!pet) {
      return res
        .status(404)
        .json({ error: "Mascota no encontrada o no autorizada." });
    }

    res.json({ message: "Mascota eliminada" });
  } catch (err) {
    console.error("Error en DELETE /api/pets/:id:", err);
    res.status(500).json({ error: "Error al eliminar la mascota." });
  }
});

module.exports = router;
