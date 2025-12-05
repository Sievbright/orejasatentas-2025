const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar usuarios
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});

module.exports = router;
