// src/Pages/Razas.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Razas.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const API_BASE = "https://orejasatentas-2025.onrender.com";

export default function Razas() {
  const query = useQuery().get("query") || "";
  const [q, setQ] = useState(query);

  // ✅ Límite base: 8 fichas por página
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pages: 1,
    limit: 8,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Controla qué tarjeta está expandida (texto completo)
  const [expandedSlug, setExpandedSlug] = useState(null);

  const fetchRazas = async (params = {}) => {
    setLoading(true);
    const url = new URL(`${API_BASE}/api/razas`);
    if (params.q) url.searchParams.set("q", params.q);
    url.searchParams.set("page", params.page || "1");
    url.searchParams.set("limit", params.limit || data.limit || "8");

    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    // Siempre vuelve a la página 1 cuando cambia la búsqueda
    fetchRazas({ q, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const razas = useMemo(() => data.items || [], [data]);

  return (
    <>
      <section className="oa-container razas-wrap">
        <header className="razas-header">
          <h1>Cuidados por Raza</h1>
          <p>Busca una raza y abre su ficha para ver cuidados específicos.</p>
          <input
            className="razas-search"
            placeholder="Buscar raza…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </header>

        {loading ? (
          <p>Cargando…</p>
        ) : (
          <>
            <div className="razas-grid">
              {razas.map((r) => {
                const id = r.slug || r._id;
                const isExpanded = expandedSlug === id;
                const resumen = r.resumen || "";

                // Solo vale la pena expandir si el texto es larguito
                const isLongResumen = resumen.length > 220;

                const handleToggle = () => {
                  if (!isLongResumen) return;
                  setExpandedSlug(isExpanded ? null : id);
                };

                return (
                  <article key={id} className="raza-card">
                    {/* portada relativa desde backend → prefijar con API_BASE */}
                    <img
                      src={`${API_BASE}${r.portada}`}
                      alt={r.nombre}
                      className="raza-img"
                    />
                    <h3>{r.nombre}</h3>

                    {/* Texto truncado a 3 líneas; clic para expandir/plegar */}
                    <p
                      className={`raza-resumen ${
                        isExpanded ? "expanded" : "collapsed"
                      } ${isLongResumen ? "clickable" : ""}`}
                      onClick={handleToggle}
                    >
                      {resumen}
                    </p>

                    <Link className="btn btn-primary" to={`/razas/${r.slug}`}>
                      Ver ficha
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Paginación */}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                className="btn btn-light"
                disabled={data.page <= 1}
                onClick={() => fetchRazas({ q, page: data.page - 1 })}
              >
                ← Anterior
              </button>
              <span style={{ alignSelf: "center" }}>
                Página {data.page} de {data.pages}
              </span>
              <button
                className="btn btn-light"
                disabled={data.page >= data.pages}
                onClick={() => fetchRazas({ q, page: data.page + 1 })}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
