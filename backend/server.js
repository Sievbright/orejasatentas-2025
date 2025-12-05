// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const iaRoutes = require("./routes/iaRoutes");
const razasRoutes = require("./routes/razas");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", // CRA
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://orejasatentas-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Estáticos (imágenes)
app.use("/static", express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/razas", razasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/ia", iaRoutes);

// Conexión MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/orejasatentas";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const cn = mongoose.connection;
    console.log("✅ Conectado a MongoDB");
    console.log(`🔎 Host: ${cn.host}  DB: ${cn.name}`);
  })
  .catch((err) => {
    console.error("❌ Error de MongoDB:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
  console.log(`🖼️ Estáticos en http://localhost:${PORT}/static`);
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
