// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Clientes from "./components/Clientes";
import Productos from "./components/Productos";
import Mesas from "./components/Mesas";
import Ventas from "./components/Ventas"; // No olvides importar tu nuevo componente
import BarraNavegacion from "./components/BarraNavegacion";
import Usuarios from "./components/Usuarios";
import Categorias from "./components/Categorias";
import VentasReporte from "./components/VentasReporte";
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
      <Route path="/ventas/:idMesa" element={<Ventas />} /> 
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/reportes" element={<VentasReporte />} />
    </Routes>
  </React.Fragment>
);

export default AppRoutes;
