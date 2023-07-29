import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "react-sidebar";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Mesas.css";
import { BaseUrl } from "../services/apiUrl";

const MesaCard = ({
  mesa,
  setSidebarContent,
  setSidebarOpen,
  refreshMesas,
}) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    const handleReservar = async () => {
      try {
        await axios.put(`${BaseUrl}/Mesas/${mesa.id}`, {
          estado: "Reservada",
          id: mesa.id,
          ventas: [],
          facturas: [],
        });
        refreshMesas(); // refresca las mesas después de la operación exitosa
      } catch (error) {
        console.error("Error al reservar la mesa", error);
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
        refreshMesas(); // refresca las mesas después de la operación exitosa
      } catch (error) {
        console.error("Error al liberar la mesa", error);
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
        refreshMesas(); // refresca las mesas después de la operación exitosa
        navigate("/mesas"); // navega a la vista de Venta con el id de la mesa
      } catch (error) {
        console.error("Error al iniciar la venta", error);
      }
    };
    setSidebarContent(
      <div>
        <h2>Mesa {mesa.id}</h2>
        <p>Estado: {mesa.estado}</p>
        {mesa.estado === "Libre" && (
          <>
            <Button variant="primary" onClick={
              () => {
                toast.success("Mesa Reservada");
                handleReservar();
                setSidebarOpen(false);
              }
            }
            >
              Reservar
            </Button>
            <Button variant="success" onClick={
              () => {
                toast.info("Venta Iniciada");
                handleIniciarVenta();
                setSidebarOpen(false);
              }
            }
            >
              Iniciar Venta
            </Button>
          </>
        )}
        {mesa.estado === "Reservada" && (
          <>
            <Button variant="warning" onClick={
              () => {
                toast.success("Mesa Liberada");
                handleLiberar();
                setSidebarOpen(false);
              }
            }
            >
              Liberar
            </Button>
            <Button variant="success" onClick={
              () => {
                toast.info(`Venta Iniciada en la mesa ${mesa.id}`);
                handleIniciarVenta();
                setSidebarOpen(false);
              }
            }
            >
              Iniciar Venta
            </Button>
          </>
        )}
        {mesa.estado === "Ocupada" && (
          navigate(`/ventas/${mesa.id}`)
        )}
      </div>
    );
    setSidebarOpen(true);
  };

  const mesaEstadoClase =
    mesa.estado === "Libre"
      ? "mesa-libre"
      : mesa.estado === "Reservada"
      ? "mesa-reservada"
      : "mesa-ocupada";

  return (
    <Card onClick={handleCardClick} className={`mesa-card ${mesaEstadoClase}`}>
      <Card.Header className="mesa-header">
        <h4>
          <FontAwesomeIcon icon={faUtensils} /> Mesa No: {mesa.id}
        </h4>
        <p>Estado: {mesa.estado}</p>
      </Card.Header>
    </Card>
  );
};

const Mesa = () => {
  const [mesas, setMesas] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(<div />);

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
    <Sidebar
      sidebar={<div className="sidebar">{sidebarContent}</div>}
      open={sidebarOpen}
      onSetOpen={setSidebarOpen}
      styles={{
        sidebar: { background: "white", width: "25%", position: "fixed" },
      }}
    >
      <Container className="container">
        <ToastContainer />
        <div className="header">
        </div>
        <Row>
          {mesas.map((mesa) => (
            <Col md={4} key={mesa.id}>
              <MesaCard
                mesa={mesa}
                setSidebarContent={setSidebarContent}
                setSidebarOpen={setSidebarOpen}
                refreshMesas={fetchMesas}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Sidebar>
  );
};

export default Mesa;
