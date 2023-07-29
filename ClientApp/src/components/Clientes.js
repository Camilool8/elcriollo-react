import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  BsPencilSquare,
  BsFillTrashFill,
  BsPlus,
  BsArrowCounterclockwise,
  BsX,
} from "react-icons/bs";
import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Fab,
  Zoom,
} from "@mui/material";

import "bootstrap/dist/css/bootstrap.min.css";
import { BaseUrl } from "../services/apiUrl";

function Clientes() {
  const [selectedClient, setSelectedClient] = useState(null);
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const fetchClients = async () => {
    const token = getToken();
    const { data } = await axios.get(`${BaseUrl}/Clientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const createClient = async (newClient) => {
    const token = getToken();
    const { data } = await axios.post(`${BaseUrl}/Clientes`, newClient, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const updateClient = async ({ id, ...updatedClient }) => {
    const token = getToken();
    const { data } = await axios.put(
      `${BaseUrl}/Clientes/${id}`,
      updatedClient,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const deleteClient = async (id) => {
    const token = getToken();
    await axios.delete(`${BaseUrl}/Clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  };

  const { data: clients, isLoading } = useQuery("clients", fetchClients);

  const mutationCreate = useMutation(createClient, {
    onSuccess: () => {
      queryClient.invalidateQueries("clients");
    },
  });

  const mutationUpdate = useMutation(updateClient, {
    onSuccess: () => {
      setSelectedClient(null);
      queryClient.invalidateQueries("clients");
    },
  });

  const mutationDelete = useMutation(deleteClient, {
    onSuccess: (deletedId) => {
      if (selectedClient?.id === deletedId) setSelectedClient(null);
      queryClient.invalidateQueries("clients");
    },
  });

  const onSubmit = (data) => {
    if (selectedClient) {
      mutationUpdate.mutate({ ...data, id: selectedClient.id });
    } else {
      mutationCreate.mutate(data);
    }
    reset();
  };

  const deselectClient = () => {
    setSelectedClient(null);
  };

  const clearForm = () => {
    reset();
  };

  useEffect(() => {
    if (selectedClient) {
      setValue("nombre", selectedClient.nombre);
      setValue("direccion", selectedClient.direccion);
      setValue("telefono", selectedClient.telefono);
    } else {
      reset();
    }
  }, [selectedClient, setValue, reset]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients?.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Grid container spacing={3}>
        {user && user.rol === "Administrador" && (
          <Grid item xs={12}>
            <Zoom in={true}>
              <Fab
                color="primary"
                aria-label="add"
                style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => {
                  setSelectedClient(null);
                  handleOpen();
                }}
              >
                <BsPlus />
              </Fab>
            </Zoom>
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h6" component="h2" mb={2} align="center">
                  Añadir / Editar Cliente
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    {...register("nombre")}
                    label="Nombre"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    {...register("direccion")}
                    label="Dirección"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    {...register("telefono")}
                    label="Teléfono"
                    fullWidth
                    margin="normal"
                  />
                  <Box mt={2}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        startIcon={
                          selectedClient ? <BsPencilSquare /> : <BsPlus />
                        }
                      >
                        {selectedClient ? "Editar" : "Crear"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<BsArrowCounterclockwise />}
                        onClick={clearForm}
                      >
                        Limpiar
                      </Button>
                      {selectedClient && (
                        <Button
                          variant="outlined"
                          startIcon={<BsX />}
                          onClick={deselectClient}
                          sx={{ mt: 2 }}
                        >
                          Deseleccionar
                        </Button>
                      )}
                    </Grid>
                  </Box>
                </form>
              </Box>
            </Modal>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" mb={1}>
            Lista de Clientes
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
                    Nombre
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    Dirección
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    Teléfono
                  </TableCell>
                  {user && user.rol === "Administrador" && (
                    <TableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      Acciones
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>Cargando clientes...</TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      onClick={() => {
                        if (user && user.rol === "Administrador") {
                          setSelectedClient(client);
                          handleOpen();
                        }
                      }}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>{client.nombre}</TableCell>
                      <TableCell>{client.direccion}</TableCell>
                      <TableCell>{client.telefono}</TableCell>
                      {user && user.rol === "Administrador" && (
                        <TableCell>
                          <IconButton onClick={() => setSelectedClient(client)}>
                            <BsPencilSquare />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              mutationDelete.mutate(client.id);
                            }}
                          >
                            <BsFillTrashFill />
                          </IconButton>
                        </TableCell>
                      )}
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

export default Clientes;
