import React, { useState } from "react";
import "./Home.css";
import perroImg from "../assets/Portada.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [breed, setBreed] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!breed.trim()) return;
    navigate(`/razas?query=${encodeURIComponent(breed.trim())}`);
  };

  return (
    <>
      {/* HERO */}
      <header className="oa-hero">
        <div className="oa-container hero-grid">
          <div className="hero-illustration" aria-hidden>
            <img
              src={perroImg}
              alt="Persona acariciando a su perro"
              className="hero-svg"
            />
          </div>

          <div className="hero-copy">
            <h1>
              Cuida a tu perro
              <br />como se merece.
              <br />
              <span className="accent">
                Conoce sus necesidades según su raza
              </span>
            </h1>

            <form
              className="search"
              onSubmit={handleSearch}
              role="search"
              aria-label="Buscador de razas"
            >
              <input
                type="text"
                className="search-input"
                placeholder="¿Qué raza es tu perro?"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                aria-label="Ingresar raza del perro"
              />
              <button type="submit" className="search-btn" aria-label="Buscar">
                →
              </button>
            </form>

            <button className="btn btn-primary" onClick={handleSearch}>
              Consultar cuidados
            </button>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="oa-features oa-container" id="cuidados">
        
        
        <article className="feature feature-green">
          <div className="feature-icon" aria-hidden>🐾</div>
          <h3>Cuidados por Raza</h3>
          <p> Consulta fichas personalizadas con alimentación, paseos, pelaje, salud y más. </p>
          <Link className="feature-link" to="/razas">Ver fichas</Link>
        </article>

        <article className="feature feature-yellow" id="consejos">
          <div className="feature-icon" aria-hidden>💡</div>
          <h3>Consejos Diarios</h3>
          <p>
            ¿Sabías que el cepillado frecuente evita infecciones en razas de
            pelo largo?
          </p>
          <Link className="feature-link" to="/consejos">
            Ver consejos
          </Link>
        </article>

        <article className="feature feature-orange" id="ley">
          <div className="feature-icon" aria-hidden>📑</div>
          <h3>Conoce tus deberes</h3>
          <p>
            Infórmate sobre la Normativa Legal vigente para responsables de
            mascotas.
          </p>
          <a
            className="feature-link"
            href="https://www.chileatiende.gob.cl/fichas/51436-ley-de-tenencia-responsable-de-mascotas-y-animales-de-compania-ley-cholito"
            target="_blank"
            rel="noopener noreferrer"
          >
            Revisar
          </a>
        </article>

        <article className="feature feature-teal" id="glosario">
          <div className="feature-icon" aria-hidden>📘</div>
          <h3>Glosario canino</h3>
          <p>
            Consulta términos como “Antiparasitario”, “Pelaje”, “Displasia” y
            más.
          </p>
          <a className="feature-link" href="#glosario-detalle">
            Abrir glosario
          </a>
        </article>
      </section>

      {/* CTA */}
      <section className="oa-cta-wrap">
        <div className="oa-container oa-cta">
          <div className="cta-text">
            <h2>¡Empieza hoy a ser un dueño informado y responsable!</h2>
          </div>
          <div className="cta-actions">
            <a href="#buscador" className="btn btn-dark">
              Acceder al Buscador de Razas
            </a>
            <Link to="/consejos" className="btn btn-light">
              Ver Consejos
            </Link>
          </div>
        </div>
      </section>
      </>
  );
}

