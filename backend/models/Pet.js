// backend/models/Pet.js
const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  breed: { type: String, required: true, trim: true },
  age: { type: Number },
  weight: { type: Number },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pet", petSchema);
