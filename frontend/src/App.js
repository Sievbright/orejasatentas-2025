import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Razas from "./Pages/Razas";
import Consejos from "./Pages/Consejos";
import Dashboard from "./Pages/Dashboard";
import IaPetPage from "./Pages/IaPetPage";
import { AuthProvider } from "./context/AuthContext";
import RazaDetalle from "./Pages/RazaDetalle";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/razas" element={<Razas />} />
            <Route path="/razas/:slug" element={<RazaDetalle />} />
            <Route path="/consejos" element={<Consejos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ia/mascota/:id" element={<IaPetPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
