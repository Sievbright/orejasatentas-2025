// src/Pages/RazaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./RazaDetalle.css"; // IMPORTANTE: este import debe existir
import "./RazaDetalle.css";


const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:4000";

const imgSrc = (src) => {
  if (!src) return "";
  return src.startsWith("http://") || src.startsWith("https://")
    ? src
    : `${API_BASE}${src}`;
};

export default function RazaDetalle() {
  const { slug } = useParams();
  const [raza, setRaza] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/razas/${slug}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          setRaza(json);
        } else {
          setRaza(null);
        }
      } catch (err) {
        console.error(err);
        setRaza(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <div className="oa-container" style={{ padding: "32px 0" }}>
        Cargando…
      </div>
    );
  }

  if (!raza) {
    return (
      <div className="oa-container" style={{ padding: "32px 0" }}>
        <h2>Raza no encontrada</h2>
        <Link to="/razas" className="btn btn-light" style={{ marginTop: 12 }}>
          Volver
        </Link>
      </div>
    );
  }

const { nombre, portada, info, bloques } = raza;

  return (
    <article className="oa-container raza-detalle">
      {/* HERO */}
      <header className="raza-hero">
        <img src={imgSrc(raza.portada)} alt={raza.nombre} className="raza-detalle-img"/>


        <div className="raza-hero-copy">
          <h1>{nombre}</h1>

          <ul className="raza-stats">
            <li>
              <strong>Peso:</strong> {info?.peso}
            </li>
            <li>
              <strong>Altura:</strong> {info?.altura}
            </li>
            <li>
              <strong>Expectativa de vida:</strong> {info?.vida}
            </li>
          </ul>

          <div className="raza-hero-actions">
            <Link to="/razas" className="btn btn-light">
              Volver al listado
            </Link>
          </div>
        </div>
      </header>

      {/* TARJETAS */}
      <section className="raza-bloques">
        {(bloques || []).map((b, i) => (
          <div key={i} className="raza-bloque">
            <div className="bloque-icon">{b.icono}</div>
            <div>
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}


