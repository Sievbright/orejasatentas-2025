const mongoose = require("mongoose");

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

module.exports = mongoose.model("Raza", RazaSchema);
