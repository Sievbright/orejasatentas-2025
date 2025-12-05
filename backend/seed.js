// seed.js (CommonJS)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Raza = require("./models/Raza");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/orejasatentas";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🌱 Seed conectado a DB: ${mongoose.connection.name}`);

    // idempotente
    await Raza.deleteMany({ slug: { $in: ["beagle", "golden"] } });

    await Raza.create([
      {
        nombre: "Beagle",
        slug: "beagle",
        portada: "/static/razas/beagle.png",
        resumen: "Raza alegre, enérgica y curiosa.",
        info: { peso: "9–11 kg", altura: "33–41 cm", vida: "12–15 años" },
        bloques: [
          { titulo: "Pelaje", texto: "Cepillado 2–3 veces/semana.", icono: "🧴" },
          { titulo: "Paseos", texto: "45–60 min diarios.", icono: "🚶" },
          { titulo: "Alimentación", texto: "Control de porciones, tendencia a engordar.", icono: "🍗" },
          { titulo: "Vacunación", texto: "Respeta calendario y desparasitación.", icono: "💉" }
        ]
      },
      {
        nombre: "Golden Retriever",
        slug: "golden",
        portada: "/static/razas/golden.png",
        resumen: "Amistoso, confiable y cariñoso.",
        info: { peso: "25–34 kg", altura: "51–61 cm", vida: "10–12 años" },
        bloques: [
          { titulo: "Pelaje", texto: "Cepillado frecuente por muda.", icono: "🧴" },
          { titulo: "Paseos", texto: "60–90 min diarios + juego.", icono: "🚶" },
          { titulo: "Alimentación", texto: "Dieta equilibrada, controlar peso.", icono: "🍗" },
          { titulo: "Vacunación", texto: "Al día y chequeos periódicos.", icono: "💉" }
        ]
      }
    ]);

    console.log("✅ Seed ok");
  } catch (e) {
    console.error("❌ Seed error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
