import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function IaPetPage() {
  const { id } = useParams();
  const { pets } = useAuth();

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return <p>No se encontró la mascota seleccionada.</p>;
  }

  return (
    <div className="ia-page">
      <h2>Futura IA para {pet.name}</h2>
      <p>
        Aquí más adelante se conectará la IA para hablar sobre los cuidados
        personalizados de <strong>{pet.name}</strong> ({pet.breed}).
      </p>
    </div>
  );
}
