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
import "./Usuarios.css";
import { BaseUrl } from "../services/apiUrl";

function Usuarios() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryuser = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const fetchUsers = async () => {
    const token = getToken();
    const { data } = await axios.get(`${BaseUrl}/Usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const createUser = async (newUser) => {
    const token = getToken();
    const { data } = await axios.post(
      `${BaseUrl}/Usuarios`,
      newUser,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const updateUser = async ({ id, ...updatedUser }) => {
    const token = getToken();
    const { data } = await axios.put(`${BaseUrl}/Usuarios/${id}`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const deleteUser = async (id) => {
    const token = getToken();
    await axios.delete(`${BaseUrl}/Usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  };

  const { data: users, isLoading } = useQuery("users", fetchUsers);

  const mutationCreate = useMutation(createUser, {
    onSuccess: () => {
      queryuser.invalidateQueries("users");
    },
  });

  const mutationUpdate = useMutation(updateUser, {
    onSuccess: () => {
      setSelectedUser(null);
      queryuser.invalidateQueries("users");
    },
  });

  const mutationDelete = useMutation(deleteUser, {
    onSuccess: (deletedId) => {
      if (selectedUser?.id === deletedId) setSelectedUser(null);
      queryuser.invalidateQueries("users");
    },
  });

  const onSubmit = (data) => {
    if (selectedUser) {
      mutationUpdate.mutate({ ...data, id: selectedUser.id });
    } else {
      mutationCreate.mutate(data);
    }
    reset();
  };

  const deselectUser = () => {
    setSelectedUser(null);
  };

  const clearForm = () => {
    reset();
  };

  useEffect(() => {
    if (selectedUser) {
      setValue("nombre", selectedUser.nombre);
      setValue("email", selectedUser.email);
      setValue("rol", selectedUser.rol);
      setValue("contraseña", selectedUser.contraseña);
    } else {
      reset();
    }
  }, [selectedUser, setValue, reset]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users?.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
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
              style={{ position: "fixed", bottom: "32px", right: "20px" }}
              onClick={() => {
                setSelectedUser(null);
                handleOpen();
              }}
            >
              <BsPlus fontSize={30} />
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
                Añadir / Editar Usuario
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register("nombre")}
                  label="Nombre"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  {...register("email")}
                  label="Email"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  {...register("rol")}
                  label="Rol"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  {...register("contraseña")}
                  label="Contraseña"
                  type="password"
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
                      startIcon={selectedUser ? <BsPencilSquare /> : <BsPlus />}
                    >
                      {selectedUser ? "Editar" : "Crear"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<BsArrowCounterclockwise />}
                      onClick={clearForm}
                    >
                      Limpiar
                    </Button>
                    {selectedUser && (
                      <Button
                        variant="outlined"
                        startIcon={<BsX />}
                        onClick={deselectUser}
                      >
                        Quitar seleccion
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
          Lista de Usuarios
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
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Rol
                </TableCell>
                {user && user.rol === "Administrador" && (
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    Editar/Borrar
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Cargando usuarios...</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedUser(user);
                            handleOpen();
                          }}
                        >
                          <BsPencilSquare />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            mutationDelete.mutate(user.id);
                          }}
                        >
                          <BsFillTrashFill />
                        </IconButton>
                      </TableCell>
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
    

export default Usuarios;
