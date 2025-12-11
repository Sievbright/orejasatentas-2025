// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { API_BASE } from "../config/api";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token inválido");
        }

        const data = await res.json();
        setUser(data.user);
        const mappedPets = (data.pets || []).map((p) => ({
          ...p,
          id: p._id,
        }));
        setPets(mappedPets);
      } catch (err) {
        console.error("Error al validar token:", err);
        localStorage.removeItem("token");
        setUser(null);
        setPets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function fetchPets(forceToken) {
    const token = forceToken || localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("No se pudieron cargar las mascotas");
      return;
    }

    const data = await res.json();
    const mapped = (data || []).map((p) => ({ ...p, id: p._id }));
    setPets(mapped);
  }

async function login(emailOrObj, passwordMaybe) {
  // Permite login({ email, password }) o login(email, password)
  let email, password;

  if (typeof emailOrObj === "object" && emailOrObj !== null) {
    email = emailOrObj.email;
    password = emailOrObj.password;
  } else {
    email = emailOrObj;
    password = passwordMaybe;
  }

  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios.");
  }

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  localStorage.setItem("token", data.token);
  setUser(data.user);
  await fetchPets(data.token);
}


  async function register({
    name,
    email,
    password,
    petName,
    petBreed,
    petAge,
  }) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        petName,
        petBreed,
        petAge,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al registrar usuario");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
    await fetchPets(data.token);
  }

  async function addPet({ name, breed, age }) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No autenticado.");

    const res = await fetch(`${API_BASE}/api/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, breed, age }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo crear la mascota.");
    }

    setPets((prev) => [...prev, { ...data, id: data._id }]);
  }

  async function removePet(id) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No autenticado.");

    const res = await fetch(`${API_BASE}/api/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo eliminar la mascota.");
    }

    setPets((prev) => prev.filter((p) => p.id !== id));
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setPets([]);
  }

  const value = {
    user,
    pets,
    login,
    register,
    addPet,
    removePet,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
