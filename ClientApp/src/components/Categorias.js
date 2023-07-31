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
import "./Categorias.css";
import { BaseUrl } from "../services/apiUrl";

function Categorias() {
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const fetchCategories = async () => {
    const token = getToken();
    const { data } = await axios.get(`${BaseUrl}/Categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const createCategory = async (newCategory) => {
    const token = getToken();
    const { data } = await axios.post(
      `${BaseUrl}/Categorias`,
      newCategory,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const updateCategory = async ({ id, ...updatedCategory }) => {
    const token = getToken();
    const { data } = await axios.put(
      `${BaseUrl}/Categorias/${id}`,
      updatedCategory,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const deleteCategory = async (id) => {
    const token = getToken();
    await axios.delete(`${BaseUrl}/Categorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  };

  const { data: categories, isLoading } = useQuery("categories", fetchCategories);

  const mutationCreate = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const mutationUpdate = useMutation(updateCategory, {
    onSuccess: () => {
      setSelectedCategory(null);
      queryClient.invalidateQueries("categories");
    },
  });

  const mutationDelete = useMutation(deleteCategory, {
    onSuccess: (deletedId) => {
      if (selectedCategory?.id === deletedId) setSelectedCategory(null);
      queryClient.invalidateQueries("categories");
    },
  });

  const onSubmit = (data) => {
    if (selectedCategory) {
      mutationUpdate.mutate({ ...data, id: selectedCategory.id });
    } else {
      mutationCreate.mutate(data);
    }
    reset();
  };

  const deselectCategory = () => {
    setSelectedCategory(null);
  };

  const clearForm = () => {
    reset();
  };

  useEffect(() => {
    if (selectedCategory) {
      setValue("nombre", selectedCategory.nombre);
      setValue("descripcion", selectedCategory.descripcion);
    } else {
      reset();
    }
  }, [selectedCategory, setValue, reset]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = categories?.filter(
    (category) =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
                  setSelectedCategory(null);
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
                  Añadir / Editar Categoría
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    {...register("nombre")}
                    label="Nombre"
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
                          selectedCategory ? <BsPencilSquare /> : <BsPlus />
                        }
                      >
                        {selectedCategory ? "Editar" : "Crear"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<BsArrowCounterclockwise />}
                        onClick={clearForm}
                      >
                        Limpiar
                      </Button>
                      {selectedCategory && (
                        <Button
                          variant="outlined"
                          startIcon={<BsX />}
                          onClick={deselectCategory}
                          sx={{ mt: 2 }}
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
            Lista de Categorías
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
                    <TableCell colSpan={2}>Cargando categorías...</TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <TableCell>{category.nombre}</TableCell>
                      {user && user.rol === "Administrador" && (
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setSelectedCategory(category);
                              handleOpen();
                            }}
                          >
                            <BsPencilSquare />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              mutationDelete.mutate(category.id);
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

export default Categorias;
