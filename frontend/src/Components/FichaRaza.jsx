// src/Components/FichaRaza.jsx
import React from "react";
import "./FichaRaza.css";

export default function FichaRaza({ nombre, peso, altura, vida, alimentacion, ejercicio, pelaje, salud, vacunas }) {
  return (
    <div className="ficha-container">
      <h1>{nombre}</h1>
      
      <section>
        <h2>Rango de Peso</h2>
        <p>{peso}</p>
      </section>

      <section>
        <h2>Altura</h2>
        <p>{altura}</p>
      </section>

      <section>
        <h2>Expectativa de vida</h2>
        <p>{vida}</p>
      </section>

      <section>
        <h2>Alimentación</h2>
        <ul>{alimentacion.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>Ejercicio</h2>
        <ul>{ejercicio.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>Cuidado del pelaje</h2>
        <ul>{pelaje.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>Salud preventiva</h2>
        <ul>{salud.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>Vacunación básica</h2>
        <ul>{vacunas.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>
    </div>
  );
}
