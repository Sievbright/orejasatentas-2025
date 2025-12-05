const mongoose = require("mongoose");

const ConsejoSchema = new mongoose.Schema(
  {
    texto: { type: String, required: true },
    categoria: { type: String, default: "general" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consejo", ConsejoSchema);
