import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    petName: "",
    petBreed: "",
    petAge: "",
  });
  const [error, setError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Debes ingresar email y contraseña.");
      return;
    }

    // Usamos el contexto en vez de una API real
    auth.login({
      email: loginData.email,
      password: loginData.password,
    });

    onClose();
    navigate("/dashboard");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.petName ||
      !registerData.petBreed
    ) {
      setError("Completa todos los campos obligatorios (*)");
      return;
    }

    auth.register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      pet: {
        name: registerData.petName,
        breed: registerData.petBreed,
        age: registerData.petAge
          ? Number(registerData.petAge)
          : undefined,
      },
    });

    onClose();
    navigate("/dashboard");
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => setMode("register")}
          >
            Registro
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              Email *
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChangeLogin}
                required
              />
            </label>
            <label>
              Contraseña *
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChangeLogin}
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="auth-submit">
              Iniciar sesión
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h3>Datos del usuario</h3>
            <label>
              Nombre *
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChangeRegister}
                required
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChangeRegister}
                required
              />
            </label>
            <label>
              Contraseña * (mínimo 6 caracteres)
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleChangeRegister}
                minLength={6}
                required
              />
            </label>

            <h3>Datos de la mascota</h3>
            <label>
              Nombre de la mascota *
              <input
                type="text"
                name="petName"
                value={registerData.petName}
                onChange={handleChangeRegister}
                required
              />
            </label>
            <label>
              Raza (ej: Beagle, Golden) *
              <input
                type="text"
                name="petBreed"
                value={registerData.petBreed}
                onChange={handleChangeRegister}
                required
              />
            </label>
            <label>
              Edad (años)
              <input
                type="number"
                name="petAge"
                value={registerData.petAge}
                onChange={handleChangeRegister}
                min={0}
              />
            </label>

            <button type="submit" className="auth-submit">
              Crear cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
