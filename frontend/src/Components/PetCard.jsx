import React from "react";
import { Link } from "react-router-dom";

export default function PetCard({ pet, onDelete }) {
  return (
    <div className="pet-card">
      <h3>{pet.name}</h3>
      <p><strong>Raza:</strong> {pet.breed}</p>
      {pet.age !== undefined && pet.age !== null && (
        <p><strong>Edad:</strong> {pet.age} años</p>
      )}

      <div className="pet-card-actions">
        {/* Botón preparado para futura IA */}
        <Link to={`/ia/mascota/${pet.id}`} className="btn-ia">
          Hablar con IA
        </Link>

        {/* Eliminar mascota */}
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(pet.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
