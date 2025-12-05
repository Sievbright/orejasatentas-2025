const { Router } = require("express");
const Consejo = require("../models/Consejo");
const router = Router();

router.get("/random", async (_req, res) => {
  const count = await Consejo.countDocuments();
  if (!count) return res.json({ texto: "Aún no hay consejos cargados." });
  const skip = Math.floor(Math.random() * count);
  const c = await Consejo.findOne().skip(skip);
  res.json(c);
});

router.post("/", async (req, res) => {
  try {
    const nuevo = await Consejo.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
