// backend/routes/iaRoutes.js
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// Inicializar cliente de OpenAI solo si hay API key
let openai = null;

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "⚠️  OPENAI_API_KEY no está definida. Las rutas de IA responderán con error 503."
  );
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * POST /api/ia/cuidado-perro
 * Body:
 * {
 *   "nombre": "Toby",
 *   "raza": "Beagle",
 *   "edad": 3,
 *   "descripcionOpcional": "Perro muy activo..."
 * }
 */
router.post("/cuidado-perro", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        ok: false,
        error:
          "Servicio de IA no configurado. Falta la variable OPENAI_API_KEY.",
      });
    }

    const { nombre, raza, edad, descripcionOpcional } = req.body || {};

    if (!nombre || !raza) {
      return res
        .status(400)
        .json({ ok: false, error: "Los campos 'nombre' y 'raza' son obligatorios." });
    }

    const instructions =
      "Eres un médico veterinario experto en bienestar canino. " +
      "Respondes SIEMPRE en español, con un tono cercano pero profesional. " +
      "Da recomendaciones prácticas de cuidado, alimentación, ejercicio, salud preventiva " +
      "y enriquecimiento ambiental. No menciones que eres una IA.";

    const input = [
      "Te doy la información de un perro y quiero recomendaciones de cuidado:",
      "",
      `- Nombre: ${nombre}`,
      `- Raza: ${raza}`,
      `- Edad: ${
        edad !== undefined && edad !== null && edad !== ""
          ? edad
          : "desconocida"
      }`,
      `- Descripción adicional: ${
        descripcionOpcional && descripcionOpcional.trim() !== ""
          ? descripcionOpcional
          : "sin información adicional"
      }`,
      "",
      "Por favor, entrega:",
      "1) Un breve resumen del perfil del perro.",
      "2) Recomendaciones diarias de cuidado (formato de viñetas).",
      "3) Recomendaciones de salud preventiva (vacunas, controles, etc.).",
      "4) Actividades de ejercicio y estimulación mental recomendadas.",
      "",
      "Máximo ~250-300 palabras.",
    ].join("\n");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions,
      input,
    });

    const textoRespuesta =
      response.output_text ||
      "No se pudo leer la respuesta de la IA. Revisa los logs del backend.";

    return res.json({
      ok: true,
      recomendaciones: textoRespuesta,
    });
  } catch (error) {
    console.error("❌ Error en /api/ia/cuidado-perro:", error);

    return res.status(500).json({
      ok: false,
      error: "Error al consultar la IA para el cuidado del perro.",
      detalle:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/ia/chat
 * Body:
 * {
 *   "question": "¿Puede salir a correr todos los días?",
 *   "petId": "opcional",
 *   "petName": "Toby",
 *   "petBreed": "Beagle"
 * }
 * No almacena conversación; responde solo a esa pregunta en corto.
 */
router.post("/chat", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        ok: false,
        error:
          "Servicio de IA no configurado. Falta la variable OPENAI_API_KEY.",
      });
    }

    const { question, petId, petName, petBreed } = req.body || {};

    if (!question || !question.trim()) {
      return res
        .status(400)
        .json({ ok: false, error: "La pregunta es obligatoria." });
    }

    const instructions =
      "Eres un veterinario experto en perros. " +
      "Respondes SIEMPRE en español, con un tono amable y claro. " +
      "Responde de forma breve (máximo 2-3 frases) y práctica. " +
      "No menciones que eres una IA.";

    const contextoMascota =
      petName || petBreed
        ? `La consulta es sobre un perro llamado ${petName || "sin nombre"} ${
            petBreed ? `de raza ${petBreed}` : ""
          }.`
        : "No se proporciona información adicional del perro.";

    const input = [
      contextoMascota,
      "",
      "Pregunta del usuario:",
      question,
      "",
      "Responde de forma breve y concreta.",
    ].join("\n");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions,
      input,
    });

    const textoRespuesta =
      response.output_text ||
      "No se pudo leer la respuesta de la IA. Revisa los logs del backend.";

    return res.json({
      ok: true,
      answer: textoRespuesta,
    });
  } catch (error) {
    console.error("❌ Error en /api/ia/chat:", error);

    return res.status(500).json({
      ok: false,
      error: "Error al consultar la IA en el chat.",
      detalle:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
