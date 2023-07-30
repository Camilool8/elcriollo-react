import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import { FaBeer } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { BaseUrl } from "../services/apiUrl";

const MesaCard = ({ mesa, refreshMesas }) => {
  const navigate = useNavigate();

  const handleReservar = async () => {
    try {
      await axios.put(`${BaseUrl}/Mesas/${mesa.id}`, {
        estado: "Reservada",
        id: mesa.id,
        ventas: [],
        facturas: [],
      });
      refreshMesas();
      toast.warning(`Mesa No: ${mesa.id} Reservada`);
    } catch (error) {
      console.error("Error al reservar la mesa", error);
      toast.error("Error al reservar la mesa");
    }
  };

  const handleLiberar = async () => {
    try {
      await axios.put(`${BaseUrl}/Mesas/${mesa.id}`, {
        estado: "Libre",
        id: mesa.id,
        ventas: [],
        facturas: [],
      });
      refreshMesas();
      toast.success(`Mesa No: ${mesa.id} Liberada`);
    } catch (error) {
      console.error("Error al liberar la mesa", error);
      toast.error("Error al liberar la mesa");
    }
  };

  const handleIniciarVenta = async () => {
    try {
      await axios.put(`${BaseUrl}/Mesas/${mesa.id}`, {
        estado: "Ocupada",
        id: mesa.id,
        ventas: [],
        facturas: [],
      });
      refreshMesas();
      toast.success(`Venta Iniciada en la mesa No: ${mesa.id}`);
      navigate("/mesas");
    } catch (error) {
      console.error("Error al iniciar la venta", error);
      toast.error("Error al iniciar la venta");
    }
  };

  const colorScheme = {
    Libre: { main: "#f6f3f6", contrast: "#267abd" },
    Reservada: { main: "#267abd", contrast: "#f6f3f6" },
    Ocupada: { main: "#da282d", contrast: "#f6f3f6" },
  };

  return (
    <Card
      sx={{
        bgcolor: colorScheme[mesa.estado].main,
        color: colorScheme[mesa.estado].contrast,
        mb: 2,
      }}
    >
      <CardHeader title={`Mesa No: ${mesa.id}`} avatar={<FaBeer size={32} />} />
      <CardContent>
        <Typography variant="h5">Mesa {mesa.estado}</Typography>
      </CardContent>
      <CardActions>
        {mesa.estado === "Libre" && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReservar}
              sx={{ mr: 2 }}
            >
              Reservar Mesa
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleIniciarVenta}
              sx={{ mr: 2 }}
            >
              Abrir Cuenta
            </Button>
          </Box>
        )}
        {mesa.estado === "Reservada" && (
          <Box>
            <Button variant="contained" color="warning" onClick={handleLiberar}>
              Liberar
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleIniciarVenta}
              sx={{ ml: 2 }}
            >
              Abrir Cuenta
            </Button>
          </Box>
        )}
        {mesa.estado === "Ocupada" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/ventas/${mesa.id}`)}
          >
            Ver Cuenta actual
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const Mesa = () => {
  const [mesas, setMesas] = useState([]);

  const fetchMesas = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/Mesas`);
      setMesas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  return (
    <Box sx={{ m: 2 }}>
      <ToastContainer />
      <Grid container spacing={2}>
        {mesas.map((mesa) => (
          <Grid item xs={12} sm={6} md={4} key={mesa.id}>
            <MesaCard mesa={mesa} refreshMesas={fetchMesas} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Mesa;
