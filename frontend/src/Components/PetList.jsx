import React from "react";
import PetCard from "./PetCard";

export default function PetList({ pets, onDelete }) {
  if (!pets || pets.length === 0) {
    return <p>No tienes mascotas registradas aún.</p>;
  }

  return (
    <div className="pet-list">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onDelete={onDelete} />
      ))}
    </div>
  );
}
