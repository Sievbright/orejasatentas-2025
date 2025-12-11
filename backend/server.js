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
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://orejasatentas.vercel.app",
];
app.use(
  cors({
    origin(origin, callback) {
      // Permitir herramientas tipo Postman (origin === undefined)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("CORS bloqueado para origen:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
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
let MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ MONGO_URI no está definido en producción");
    process.exit(1);
  } else {
    // fallback solo en desarrollo local
    MONGO_URI = "mongodb://127.0.0.1:27017/orejasatentas";
    console.warn("⚠️ Usando Mongo local por defecto:", MONGO_URI);
  }
}

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

// backend/middleware/auth.js y backend/routes/authRoutes.js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    "⚠️ JWT_SECRET no está definido. Se usará un secret inseguro sólo para desarrollo."
  );
}

const SECRET = JWT_SECRET || "dev-secret-key";
