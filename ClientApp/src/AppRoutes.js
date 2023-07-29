// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Clientes from "./components/Clientes";
import Productos from "./components/Productos";
import Mesas from "./components/Mesas";
import Ventas from "./components/Ventas"; // No olvides importar tu nuevo componente
import Administracion from "./components/Administracion";
import BarraNavegacion from "./components/BarraNavegacion";
import "./App.css";

const AppRoutes = () => (
  <React.Fragment>
    <BarraNavegacion />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/mesas" element={<Mesas />} />
      <Route path="/ventas/:idMesa" element={<Ventas />} /> {/* Nueva ruta */}
      <Route path="/administracion" element={<Administracion />} />
    </Routes>
  </React.Fragment>
);

export default AppRoutes;
