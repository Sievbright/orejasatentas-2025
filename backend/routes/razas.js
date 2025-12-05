// backend/routes/razas.js
const express = require("express");
const mongoose = require("mongoose");



// 🔥 Definimos el esquema aquí mismo para que Render NO dependa de ../models/Raza
const BloqueSchema = new mongoose.Schema(
  { titulo: String, texto: String, icono: String },
  { _id: false }
);

const InfoSchema = new mongoose.Schema(
  { peso: String, altura: String, vida: String },
  { _id: false }
);

const RazaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    portada: String,
    info: InfoSchema,
    bloques: [BloqueSchema],
    resumen: String,
  },
  { timestamps: true }
);

// Si el modelo ya existe (por hot reload/local), lo reutilizamos, si no, lo creamos
const Raza =
  mongoose.models.Raza || mongoose.model("Raza", RazaSchema);


const router = express.Router();

/**
 * GET /api/razas
 * Query opcionales: q, page, limit
 */
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "12", 10), 1);

    const filter = q
      ? {
          $or: [
            { nombre: { $regex: q, $options: "i" } },
            { resumen: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const total = await Raza.countDocuments(filter);
    const items = await Raza.find(filter)
      .sort({ nombre: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      items,
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al listar razas", error: err.message });
  }
});

// GET /api/razas/:slug  → detalle por slug (o id)
router.get("/:slugOrId", async (req, res) => {
  try {
    const { slugOrId } = req.params;

    // Primero intenta por slug
    let raza = await Raza.findOne({ slug: slugOrId });
    // Si no hay slug, intenta por _id
    if (!raza) {
      raza = await Raza.findById(slugOrId);
    }

    if (!raza) {
      return res.status(404).json({ message: "Raza no encontrada" });
    }

    res.json(raza);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al obtener la raza", error: err.message });
  }
});


/**
 * POST /api/razas
 * Crea una raza nueva
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, slug } = req.body || {};
    if (!nombre || !slug) {
      return res.status(400).json({
        message: "Los campos 'nombre' y 'slug' son obligatorios",
      });
    }

    const exists = await Raza.findOne({ slug });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Ya existe una raza con ese slug" });
    }

    // portada esperada como "/static/razas/xxx.png"
    const nueva = await Raza.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al crear la raza", error: err.message });
  }
});

/**
 * PUT /api/razas/:id
 * Actualiza una raza por _id
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Raza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Raza no encontrada" });
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al actualizar la raza", error: err.message });
  }
});

/**
 * DELETE /api/razas/:id
 * Elimina una raza por _id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Raza.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Raza no encontrada" });
    res.json({ message: "Raza eliminada" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al eliminar la raza", error: err.message });
  }
});

module.exports = router;
