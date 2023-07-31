import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  BsFillTrashFill,
  BsPencilSquare,
  BsPlus,
  BsX,
  BsArrowCounterclockwise,
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
  MenuItem,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Productos.css";
import { BaseUrl } from "../services/apiUrl";

function Productos() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset, setValue, control } = useForm();
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

  const fetchProductos = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${BaseUrl}/Productos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const fetchCategorias = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${BaseUrl}/Categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const fetchInventario = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${BaseUrl}/Inventarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const createProducto = async (newProduct) => {
    const token = await getToken();

    // Creando el producto
    const productResponse = await axios.post(
      `${BaseUrl}/Productos`,
      newProduct,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Obteniendo el ID del producto recién creado
    const productId = productResponse.data.id;

    // Creando el inventario para el nuevo producto
    const inventory = {
      productoId: productId,
      cantidad: newProduct.cantidad, // usa la cantidad desde newProduct
    };

    // Haciendo el POST en el inventario
    await axios.post(`${BaseUrl}/Inventarios`, inventory, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return productResponse.data;
  };

  const updateProducto = async ({ id, cantidad, ...updatedProduct }) => {
    const token = await getToken();
    updatedProduct.Id = id; // Add the id back into updatedProduct.
    const { data } = await axios.put(
      `${BaseUrl}/Productos/${id}`,
      updatedProduct,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const updateInventario = async ({ productoId, ...updatedInventory }) => {
    const token = await getToken();
    if (typeof updatedInventory.cantidad === "string")
      updatedInventory.cantidad = parseInt(updatedInventory.cantidad);

    // Adding Id as a property to the updatedInventory object.
    updatedInventory.Id = productoId;
    updatedInventory.productoId = productoId;

    const { data } = await axios.put(
      `${BaseUrl}/Inventarios/${productoId}`,
      {
        ...updatedInventory,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const deleteProducto = async (id) => {
    const token = await getToken();
    await axios.delete(`${BaseUrl}/Productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  };

  const { data: productos, isLoading: productosLoading } = useQuery(
    "productos",
    fetchProductos
  );
  const { data: categorias, isLoading: categoriasLoading } = useQuery(
    "categorias",
    fetchCategorias
  );
  const { data: inventarios, isLoading: inventariosLoading } = useQuery(
    "inventarios",
    fetchInventario
  );

  const filteredProducts = productos?.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mutationCreate = useMutation(createProducto, {
    onSuccess: () => {
      queryClient.invalidateQueries("productos");
      queryClient.invalidateQueries("inventarios");
    },
  });

  const mutationUpdate = useMutation(updateProducto, {
    onSuccess: () => {
      setSelectedProduct(null);
      queryClient.invalidateQueries("productos");
    },
  });

  const mutationUpdateInventory = useMutation(updateInventario, {
    onSuccess: () => {
      queryClient.invalidateQueries("inventarios");
    },
  });

  const mutationDelete = useMutation(deleteProducto, {
    onSuccess: (deletedId) => {
      if (selectedProduct?.id === deletedId) setSelectedProduct(null);
      queryClient.invalidateQueries("productos");
    },
  });

  const onSubmit = (data) => {
    if (selectedProduct) {
      mutationUpdate.mutate({ ...data, id: selectedProduct.id });
      mutationUpdateInventory.mutate({
        productoId: selectedProduct.id,
        cantidad: data.cantidad,
      });
    } else {
      mutationCreate.mutate(data);
    }
    reset();
  };

  const deselectProduct = () => {
    setSelectedProduct(null);
  };

  const clearForm = () => {
    reset();
  };

  useEffect(() => {
    if (selectedProduct) {
      setValue("codigo", selectedProduct.codigo);
      setValue("nombre", selectedProduct.nombre);
      setValue("precio", selectedProduct.precio);
      setValue(
        "cantidad",
        inventarios.find((inv) => inv.productoId === selectedProduct.id)
          ?.cantidad
      );
      setValue("categoriaId", selectedProduct.categoriaId);
    } else {
      reset();
    }
  }, [selectedProduct, setValue, reset, inventarios]);

  if (productosLoading || categoriasLoading || inventariosLoading) {
    return "Loading...";
  }
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
                  setSelectedProduct(null);
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
                  Añadir / Editar Producto
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    {...register("codigo")}
                    label="Codigo"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    {...register("nombre")}
                    label="Nombre"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    {...register("precio")}
                    label="Precio"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    {...register("cantidad")}
                    label="Cantidad"
                    fullWidth
                    margin="normal"
                  />
                  <Controller
                    name="categoriaId"
                    control={control}
                    defaultValue="" // puedes cambiar esto al valor inicial que necesites
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Categoria"
                        fullWidth
                        margin="normal"
                      >
                        {categorias.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
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
                          selectedProduct ? <BsPencilSquare /> : <BsPlus />
                        }
                      >
                        {selectedProduct ? "Editar" : "Crear"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<BsArrowCounterclockwise />}
                        onClick={clearForm}
                      >
                        Limpiar
                      </Button>
                      {selectedProduct && (
                        <Button
                          variant="outlined"
                          startIcon={<BsX />}
                          onClick={deselectProduct}
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
            Lista de Productos
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
                    Codigo
                  </TableCell>
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
                    Precio
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    Cantidad
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    Categoria
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
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{product.codigo}</TableCell>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>{product.precio}</TableCell>
                    <TableCell>
                      {
                        inventarios.find((inv) => inv.productoId === product.id)
                          ?.cantidad
                      }
                    </TableCell>
                    <TableCell>
                      {
                        categorias.find((cat) => cat.id === product.categoriaId)
                          ?.nombre
                      }
                    </TableCell>
                    {user && user.rol === "Administrador" && (
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            setSelectedProduct(product);
                            handleOpen();
                          }}
                        >
                          <BsPencilSquare />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            mutationDelete.mutate(product.id);
                          }}
                        >
                          <BsFillTrashFill />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Productos;
