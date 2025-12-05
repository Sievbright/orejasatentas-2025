import React, { useState } from "react";
import Layout from "../Components/Layout";

export default function Consejos() {
  const consejos = [
    "Cepilla a tu perro al menos 3 veces por semana para evitar enredos.",
    "Realiza paseos diarios de 30 a 60 minutos para mantenerlo saludable.",
    "Mantén agua fresca disponible en todo momento.",
    "Visita al veterinario 1 vez al año para chequeos preventivos.",
    "Evita dar chocolate o uvas: son tóxicos para los perros.",
    "Usa juguetes adecuados para canalizar la masticación.",
  ];

  const [consejo, setConsejo] = useState(
    consejos[Math.floor(Math.random() * consejos.length)]
  );

  const nuevoConsejo = () => {
    let next = consejo;
    while (next === consejo && consejos.length > 1) {
      next = consejos[Math.floor(Math.random() * consejos.length)];
    }
    setConsejo(next);
  };

return (
    <>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Consejos Diarios 🐾</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{consejo}</p>
        <button
          onClick={nuevoConsejo}
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          Ver otro consejo
        </button>
      </div>
    </>
  );
}