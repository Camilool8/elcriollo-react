import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useQuery } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VentasReporte.css";
import { BaseUrl } from "../services/apiUrl"; 
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

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
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" mb={1}>
          Lista de ventas
        </Typography>
        <TextField
          label="Buscar..."
          fullWidth
          onChange={handleSearch}
          sx={{ mb: 2, border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "70vh", overflowY: "scroll" }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Fecha
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  UsuarioId
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Cliente
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Productos
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Método de Pago
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>Cargando ventas...</TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.fecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{sale.usuarioId}</TableCell>
                    <TableCell>{sale.cliente.nombre}</TableCell>
                    <TableCell>
                      {sale.detalleVentas.map((detalle) => (
                        <div key={detalle.id}>
                          {detalle.producto.nombre} x {detalle.cantidad}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{sale.metodoPago}</TableCell>
                    <TableCell>{sale.estado}</TableCell>
                    <TableCell>RD${sale.total}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </Container>
);
}

export default VentasReporte;
