import React from "react";
import Layout from "../Components/Layout";
import FichaRaza from "../Components/FichaRaza";

export default function GoldenRetriever() {
  return (
    <Layout>
      <FichaRaza
        nombre="Golden Retriever"
        peso="Machos: 29-34 kg | Hembras: 25-29 kg"
        altura="Machos: 58-61 cm | Hembras: 55-57 cm"
        vida="10-12 años"
        alimentacion={[
          "Alimento de alta calidad para razas grandes (pollo, salmón, cordero, pavo).",
          "Dividir en 2 comidas diarias: aprox. 180-230 g por comida.",
          "Controlar porciones para evitar sobrepeso."
        ]}
        ejercicio={[
          "1-2 horas de ejercicio diario.",
          "Actividades: paseos largos, correr, nadar, juegos con pelota o frisbee.",
          "Tiempo para olfatear en paseos para estimulación mental."
        ]}
        pelaje={[
          "Cepillado 2-3 veces por semana.",
          "Cepillado diario en temporadas de muda.",
          "Baños cada 4-6 semanas con shampoo adecuado."
        ]}
        salud={[
          "Displasia de cadera y codo → mantener peso saludable, evitar exceso de ejercicio en cachorros.",
          "Problemas cardíacos (estenosis aórtica subvalvular) → chequeos veterinarios regulares.",
          "Alta incidencia de cáncer (linfoma, hemangiosarcoma, mastocitoma).",
          "Problemas oculares (cataratas, PRA, displasia de retina)."
        ]}
        vacunas={[
          "Esenciales: Moquillo, Parvovirus, Adenovirus, Parainfluenza, Rabia.",
          "Opcionales: Leptospirosis, Bordetella bronchiseptica (tos de las perreras)."
        ]}
      />
    </Layout>
  );
}
