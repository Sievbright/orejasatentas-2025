// src/config/api.js
// Para CRA (create-react-app) las env vars deben empezar por REACT_APP_
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:4000"; // fallback para desarrollo local

export { API_BASE };
