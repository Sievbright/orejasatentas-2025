// src/Pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";
const API_IA_RECOMENDACIONES = `${API_BASE}/api/ia/cuidado-perro`;
const API_IA_CHAT = `${API_BASE}/api/ia/chat`;

export default function Dashboard() {
  const { user, pets, addPet, removePet, loading } = useAuth();

  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
  });

  // IA recomendaciones
  const [iaLoadingPetId, setIaLoadingPetId] = useState(null);
  const [iaError, setIaError] = useState("");
  const [iaResult, setIaResult] = useState(null); // { petId, petName, text }

  // Chat corto con la IA
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]); // { from: 'user'|'ia', text }
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPet.name.trim() || !newPet.breed.trim()) {
      return;
    }

    try {
      await addPet({
        name: newPet.name.trim(),
        breed: newPet.breed.trim(),
        age: newPet.age ? Number(newPet.age) : undefined,
      });

      setNewPet({
        name: "",
        breed: "",
        age: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo guardar la mascota.");
    }
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm("¿Quieres eliminar esta mascota?")) return;
    try {
      await removePet(id);
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo eliminar la mascota.");
    }
  };

  const handleConsultIa = async (pet) => {
    setIaError("");
    setIaResult(null);
    setIaLoadingPetId(pet.id);
    setChatMessages([]);
    setChatQuestion("");
    setChatError("");

    try {
      const response = await fetch(API_IA_RECOMENDACIONES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: pet.name,
          raza: pet.breed,
          edad: pet.age,
          descripcionOpcional: "",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener una respuesta de la IA.");
      }

      const data = await response.json();

      const textoRespuesta =
        data.recomendaciones ||
        data.mensaje ||
        "La IA respondió, pero no se encontró el campo de recomendaciones.";

      setIaResult({
        petId: pet.id,
        petName: pet.name,
        text: textoRespuesta,
      });
    } catch (error) {
      console.error(error);
      setIaError(
        "No pudimos consultar la IA en este momento. Intenta nuevamente más tarde."
      );
    } finally {
      setIaLoadingPetId(null);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    setChatError("");

    if (!iaResult) {
      setChatError(
        "Primero consulta recomendaciones para alguna mascota y luego haz preguntas."
      );
      return;
    }

    if (!chatQuestion.trim()) return;

    const userMsg = { from: "user", text: chatQuestion.trim() };
    const petName = iaResult.petName;
    const pet = pets.find((p) => p.id === iaResult.petId);
    const petBreed = pet?.breed;

    setChatMessages((prev) => [...prev, userMsg]);
    setChatQuestion("");
    setChatLoading(true);

    try {
      const response = await fetch(API_IA_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMsg.text,
          petId: iaResult.petId,
          petName,
          petBreed,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "No se pudo obtener una respuesta de la IA."
        );
      }

      const iaMsg = { from: "ia", text: data.answer };
      setChatMessages((prev) => [...prev, iaMsg]);
    } catch (err) {
      console.error(err);
      setChatError(
        err.message ||
          "Ocurrió un problema al consultar la IA. Intenta nuevamente."
      );
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || "tutor canino";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Mis mascotas</h1>
            <p className="dashboard-greeting">
              Hola, <span className="dashboard-username">{displayName}</span>
            </p>
            <p className="dashboard-subtitle">
              Administra tus perros, consulta recomendaciones con IA y lleva un
              registro sencillo de sus cuidados diarios.
            </p>
          </div>
          <div className="dashboard-header-actions">
            <span className="pill">
              {pets && pets.length > 0
                ? `${pets.length} mascota${
                    pets.length !== 1 ? "s" : ""
                  } registrada${pets.length !== 1 ? "s" : ""}`
                : "Aún no tienes mascotas registradas"}
            </span>
          </div>
        </header>

        <section className="dashboard-main">
          {/* LISTADO DE MASCOTAS */}
          <div className="dashboard-pets">
            <div className="dashboard-section-header">
              <h2>Listado de mascotas</h2>
              {/* 🔥 Botón "+ agregar nueva mascota" eliminado aquí */}
            </div>

            {(!pets || pets.length === 0) && (
              <p className="dashboard-empty">
                Todavía no has agregado ninguna mascota. Usa el formulario de la
                derecha para registrar a tu primera compañera peluda 🐾
              </p>
            )}

            {pets && pets.length > 0 && (
              <div className="pet-grid">
                {pets.map((pet) => (
                  <article key={pet.id} className="pet-card">
                    <div className="pet-card-header">
                      <h3 className="pet-name">{pet.name}</h3>
                      {pet.breed && (
                        <span className="pet-breed-tag">{pet.breed}</span>
                      )}
                    </div>

                    <ul className="pet-meta">
                      {pet.breed && (
                        <li>
                          <span className="meta-label">Raza</span>
                          <span className="meta-value">{pet.breed}</span>
                        </li>
                      )}
                      {pet.age !== undefined &&
                        pet.age !== null &&
                        pet.age !== "" && (
                          <li>
                            <span className="meta-label">Edad</span>
                            <span className="meta-value">
                              {pet.age} año{Number(pet.age) === 1 ? "" : "s"}
                            </span>
                          </li>
                        )}
                    </ul>

                    <div className="pet-card-actions">
                      <button
                        type="button"
                        className="btn-ia"
                        onClick={() => handleConsultIa(pet)}
                        disabled={iaLoadingPetId === pet.id}
                      >
                        {iaLoadingPetId === pet.id
                          ? "Consultando IA..."
                          : "Consultar IA sobre esta mascota"}
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* FORMULARIO NUEVA MASCOTA */}
          <aside className="dashboard-sidebar" id="form-nueva-mascota">
            <h2>Agregar nueva mascota</h2>
            <p className="sidebar-text">
              Completa estos datos básicos. Luego podrás usar la IA para obtener
              consejos personalizados.
            </p>

            <form className="pet-form" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>Nombre</span>
                <input
                  type="text"
                  name="name"
                  value={newPet.name}
                  onChange={handleChange}
                  placeholder="Ej: Toby"
                  required
                />
              </label>

              <label className="form-field">
                <span>Raza</span>
                <input
                  type="text"
                  name="breed"
                  value={newPet.breed}
                  onChange={handleChange}
                  placeholder="Ej: Beagle"
                  required
                />
              </label>

              <label className="form-field">
                <span>Edad (años)</span>
                <input
                  type="number"
                  name="age"
                  value={newPet.age}
                  onChange={handleChange}
                  min={0}
                  placeholder="Ej: 3"
                />
              </label>

              <button type="submit" className="btn-add-pet">
                Guardar mascota
              </button>
            </form>
          </aside>
        </section>

        {(iaResult || iaError) && (
          <section className="dashboard-ia-panel">
            {iaResult && (
              <>
                <h2>
                  Recomendaciones de cuidado para{" "}
                  <span className="dashboard-username">
                    {iaResult.petName}
                  </span>
                </h2>
                <p className="ia-text">
                  {iaResult.text.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>

                {/* Chat corto con la IA */}
                <div className="ia-chat">
                  <h3>¿Tienes más dudas?</h3>
                  <div className="ia-chat-messages">
                    {chatMessages.length === 0 && (
                      <p className="ia-chat-empty">
                        Escribe una pregunta corta y obtén una respuesta rápida
                        de la IA sobre el cuidado de tu perro.
                      </p>
                    )}

                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`ia-chat-message ia-chat-message-${msg.from}`}
                      >
                        <span className="ia-chat-label">
                          {msg.from === "user" ? "Tú" : "IA"}
                        </span>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form className="ia-chat-form" onSubmit={handleSendChat}>
                    <input
                      type="text"
                      value={chatQuestion}
                      onChange={(e) => setChatQuestion(e.target.value)}
                      placeholder="Escribe una duda corta sobre tu perro..."
                      disabled={chatLoading}
                    />
                    <button type="submit" disabled={chatLoading}>
                      {chatLoading ? "Consultando..." : "Enviar"}
                    </button>
                  </form>

                  {chatError && <p className="ia-error">{chatError}</p>}
                </div>
              </>
            )}

            {iaError && <p className="ia-error">{iaError}</p>}
          </section>
        )}
      </div>
    </div>
  );
}
