import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Pages/Home.css";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenAuth = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    setShowAuth(false);
    navigate("/");
  };

  return (
    <div className="oa-page">
      {/* NAVBAR */}
      <nav className="oa-nav">
        <div className="oa-container nav-inner">
          <div className="brand">
            <span className="brand-logo" aria-hidden>
              🐶
            </span>
            <span className="brand-text">
              Orejas<span>Atentas</span>
            </span>
          </div>

          {/* enlaces centrales: Inicio, Cuidados de raza, Consejos diarios, etc. */}
          <ul className="nav-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/razas">Cuidados por Raza</Link>
            </li>
            <li>
              <Link to="/consejos">Consejos Diarios</Link>
            </li>
            <li>
              <a
                href="https://www.chileatiende.gob.cl/fichas/51436-ley-de-tenencia-responsable-de-mascotas-y-animales-de-compania"
                target="_blank"
                rel="noopener noreferrer"
              >
                Normativa Legal
              </a>
            </li>
            <li>
              <a href="#glosario">Glosario</a>
            </li>
          </ul>

          {/* zona derecha: login o panel según estado */}
          <div className="nav-auth">
            {!user ? (
              <button
                type="button"
                className="btn-auth"
                onClick={handleOpenAuth}
              >
                Login / Registro
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-auth"
                  onClick={handleGoDashboard}
                >
                  Mi Panel
                </button>
                <button
                  type="button"
                  className="btn-auth btn-auth-secondary"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENIDO DE LA PÁGINA */}
      <main>{children}</main>

      {/* MODAL LOGIN / REGISTRO */}
      <AuthModal open={showAuth} onClose={handleCloseAuth} />

      {/* FOOTER */}
      <footer className="oa-footer">
        <div className="oa-container footer-inner">
          <ul className="footer-links">
            <li>
              <a href="#contacto">Contacto</a>
            </li>
            <li>
              <a href="#privacidad">Política de privacidad</a>
            </li>
            <li>
              <a href="#creditos">Créditos</a>
            </li>
          </ul>
          <p className="copyright">
            © 2025 OrejasAtentas – Plataforma educativa sobre tenencia responsable
            canina
          </p>
        </div>
      </footer>
    </div>
  );
}
