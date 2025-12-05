// src/data/razas.js
export const razas = [
  {
    id: "beagle",
    nombre: "Beagle",
    slug: "beagle",
    portada: require("../assets/beagle.png"), // pon tu imagen aquí
    info: {
      peso: "9–11 kg",
      altura: "33–41 cm",
      vida: "12–15 años",
    },
    bloques: [
      {
        titulo: "Alimentación",
        texto:
          "Alimento de alta calidad con proteína principal (pollo, salmón, cordero o pavo). 2 comidas diarias de 180–230 g. Controlar cantidad para evitar sobrepeso.",
        icono: "🥣",
      },
      {
        titulo: "Ejercicio",
        texto:
          "1–2 horas diarias. Permitir olfateo y juegos activos (pelotas, frisbee, escondites de premios).",
        icono: "🐾",
      },
      {
        titulo: "Pelaje",
        texto:
          "Cepillado 1 vez por semana para retirar pelo muerto. Baño cuando sea necesario.",
        icono: "🪮",
      },
      {
        titulo: "Salud Preventiva",
        texto:
          "Chequeos anuales. Cuidar obesidad por apetito. Atender posibles otitis y problemas tiroideos.",
        icono: "🛡️",
      },
      {
        titulo: "Vacunación",
        texto:
          "Cumplir calendario: moquillo, parvovirus, hepatitis infecciosa canina, rabia, etc.",
        icono: "💉",
      },
    ],
    resumen:
      "Raza alegre, enérgica y curiosa. Ideal para familias activas. Requiere ejercicio y estimulación mental.",
  },
  // Agrega más razas aquí
  {
  id: "golden",
  nombre: "Golden Retriever",
  slug: "golden-retriever",
  portada: require("../assets/golden.png"),
  info: {
    peso: "Machos: 29-34 kg | Hembras: 25-29 kg",
    altura: "Machos: 58-61 cm | Hembras: 55-57 cm",
    vida: "10-12 años"
  },
  bloques: [
    {
      titulo: "Alimentación",
      texto: "Alimento de alta calidad para razas grandes (pollo, salmón, cordero o pavo). Dividir en 2 comidas diarias (180–230 g aprox.). Controlar porciones para evitar sobrepeso.",
      icono: "🥣"
    },
    {
      titulo: "Ejercicio",
      texto: "1–2 horas de ejercicio diario. Actividades variadas: paseos largos, correr, nadar, juegos con pelota o frisbee. Permitir olfateo para estimulación mental.",
      icono: "🐾"
    },
    {
      titulo: "Pelaje",
      texto: "Cepillado 2–3 veces por semana. Diario en temporadas de muda. Baño cada 4–6 semanas con champú adecuado.",
      icono: "🪮"
    },
    {
      titulo: "Salud Preventiva",
      texto: "Propenso a displasia de cadera y codo, problemas cardíacos (estenosis aórtica), cáncer y problemas oculares. Revisiones veterinarias frecuentes son clave.",
      icono: "🛡️"
    },
    {
      titulo: "Vacunación",
      texto: "Esenciales: Moquillo, Parvovirus, Adenovirus, Parainfluenza, Rabia. Opcionales: Leptospirosis y Bordetella bronchiseptica.",
      icono: "💉"
    }
  ],
  resumen: "Raza leal, cariñosa y muy activa. Ideal para familias, requiere ejercicio diario y cuidados de pelaje constantes."
}

];

