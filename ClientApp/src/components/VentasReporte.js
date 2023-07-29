import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useQuery } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VentasReporte.css";
import { BaseUrl } from "../services/apiUrl";

function VentasReporte() {
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const fetchSales = async () => {
    const token = getToken();
    const { data } = await axios.get(`${BaseUrl}/api/Ventas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const { data: sales, isLoading } = useQuery("sales", fetchSales);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSales = sales?.filter((sale) =>
    sale.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.usuarioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.metodoPago.toLowerCase().includes(searchTerm.toLowerCase())

  );

  return (
    <div className="sales-container row g-3">
      <div className="sales-list-container-full p-4 bg-light rounded-3 shadow">
        <h2 className="mb-4">Lista de ventas</h2>
        <input
          type="text"
          className="form-control form-input mb-4"
          placeholder="Buscar..."
          onChange={handleSearch} // Add onChange to capture user input
        />
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID Vendedor</th>
                <th>Cliente</th>
                <th>Productos Vendidos</th>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">Cargando ventas...</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.usuarioId}</td>
                    <td>{sale.cliente.nombre}</td>
                    <td>
                      {sale.detalleVentas.map((detalle) => (
                        <div key={detalle.id}>
                          {detalle.producto.nombre} x {detalle.cantidad}
                        </div>
                      ))}
                    </td>
                    <td>{new Date(sale.fecha).toLocaleDateString()}</td>
                    <td>{sale.metodoPago}</td>
                    <td>{sale.estado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VentasReporte;
