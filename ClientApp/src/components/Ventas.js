import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import _ from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../services/apiUrl";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8ccf9c",
    },
    secondary: {
      main: "#d6e7ce",
    },
    background: {
      default: "#eff7ef",
    },
  },
});

const DividirCuenta = ({ modalOpen, setModalOpen, carrito, setCuentas }) => {
  const [cuentasInternas, setCuentasInterno] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});

  const handleAddCuenta = () => {
    setCuentasInterno((prevCuentas) => [
      ...prevCuentas,
      { id: prevCuentas.length + 1, total: 0, productos: [] },
    ]);
  };

const handleAsignacion = (event, productoId, producto) => {
  const cuentaId = event.target.value;
  const prevCuentaId = asignaciones[productoId];

  // Actualizar las asignaciones
  setAsignaciones((prevAsignaciones) => ({
    ...prevAsignaciones,
    [productoId]: cuentaId,
  }));

  // Actualizar cuentasInternas
  setCuentasInterno((prevCuentas) => {
    return prevCuentas.map((cuenta) => {
      const cuentaCopy = { ...cuenta }; // Hacemos una copia de la cuenta actual
      const existenteProductoIndex = cuentaCopy.productos.findIndex(
        (p) => p.id === productoId
      );

      // Si estamos asignando a esta cuenta
      if (cuenta.id === Number(cuentaId)) {
        const nuevoProducto = { ...producto, cantidad: producto.cantidad };
        if (existenteProductoIndex > -1) {
          const productoExistente = {
            ...cuentaCopy.productos[existenteProductoIndex],
          };
          productoExistente.cantidad = producto.cantidad;
          cuentaCopy.productos[existenteProductoIndex] = productoExistente;
        } else {
          cuentaCopy.productos.push(nuevoProducto);
        }
        cuentaCopy.total += producto.precio * nuevoProducto.cantidad; // Multiplicamos por la cantidad
      }

      // Si estamos desasignando de esta cuenta
      else if (
        cuenta.id === Number(prevCuentaId) &&
        existenteProductoIndex > -1
      ) {
        const productoExistente = {
          ...cuentaCopy.productos[existenteProductoIndex],
        };
        productoExistente.cantidad -= producto.cantidad;
        if (productoExistente.cantidad <= 0) {
          cuentaCopy.productos = cuentaCopy.productos.filter(
            (p) => p.id !== productoId
          );
        } else {
          cuentaCopy.productos[existenteProductoIndex] = productoExistente;
        }
        cuentaCopy.total -= producto.precio * producto.cantidad; // Restamos por la cantidad
      }

      return cuentaCopy;
    });
  });
};


  const handleGuardar = () => {
    // Asignar las cuentas y asignaciones al estado principal de la aplicación
    setCuentas(cuentasInternas);
    console.log("Asignaciones: ", asignaciones);
    console.log("Cuentas: ", cuentasInternas);
    // Aquí puedes llamar a la lógica para guardar las asignaciones de los productos a las cuentas
    setModalOpen(false);
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100vh",
        marginBottom: "4rem",
      }}
    >
      <Card
        style={{
          minWidth: 500,
          maxHeight: "600px",
          padding: "1rem",
          overflowY: "scroll",
        }}
      >
        <Typography
          variant="h6"
          id="modal-modal-title"
          component="h2"
          style={{ marginBottom: "1rem" }}
        >
          Dividir Cuenta
        </Typography>
        <Box>
          <Button color="primary" onClick={handleAddCuenta}>
            Añadir Cuenta
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="center">Cuenta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carrito.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell component="th" scope="row">
                      {producto.nombre}
                    </TableCell>
                    <TableCell align="right">{producto.cantidad}</TableCell>
                    <TableCell align="right">RD${producto.precio}</TableCell>
                    <TableCell align="right">
                      <Select
                        value={asignaciones[producto.id] || ""}
                        onChange={(event) =>
                          handleAsignacion(event, producto.id, producto)
                        }
                      >
                        {cuentasInternas.map((cuenta) => (
                          <MenuItem key={cuenta.id} value={cuenta.id}>
                            {`Cuenta ${cuenta.id}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <>
          <Typography
            variant="h6"
            id="modal-modal-title"
            component="h2"
            style={{ marginTop: "1rem" }}
          >
            Cuentas
          </Typography>
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cuenta</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cuentasInternas.map((cuenta) => (
                    <TableRow key={cuenta.id}>
                      <TableCell component="th" scope="row">
                        {`Cuenta ${cuenta.id}`}
                      </TableCell>
                      <TableCell align="right">RD${cuenta.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
        <CardActions>
          <Button color="primary" onClick={handleGuardar}>
            Guardar
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

const FacturaCard = ({ factura, vendedor, cliente }) => (
  <Card variant="outlined" style={{ marginBottom: "2rem", padding: "1rem" }}>
    <Typography variant="h6">Factura {factura.id}</Typography>
    <Typography>Vendedor: {vendedor.id}</Typography>
    <Typography>Cliente: {cliente.nombre}</Typography>

    <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {factura.productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell component="th" scope="row">
                {producto.nombre}
              </TableCell>
              <TableCell align="right">{producto.cantidad}</TableCell>
              <TableCell align="right">{`RD$ ${producto.precio}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Typography style={{ marginTop: "1rem" }}>
      Subtotal: RD$ {factura.total}
    </Typography>
    <Typography>Total: RD$ {factura.total}</Typography>
  </Card>
);

const Facturar = ({
  vendedor,
  cliente,
  cuentas,
  carrito,
  modalOpen,
  setModalOpen,
  cerrarVenta,
  setMetodoPago,
  metodoPago1,
}) => {
  // Si el estado de las cuentas es 0, utilizamos el carrito por defecto.
  const facturas =
    cuentas.length > 0
      ? cuentas
      : [
          {
            id: 1,
            productos: carrito,
            total: carrito.reduce((a, b) => a + b.precio * b.cantidad, 0),
          },
        ];

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100vh",
        marginBottom: "4rem"
      }}
    >
      <Card
        style={{
          minWidth: 500,
          maxHeight: "600px",
          padding: "1rem",
          overflowY: "scroll",
        }}
      >
        <Typography
          variant="h6"
          id="modal-modal-title"
          component="h2"
          style={{ marginBottom: "1rem" }}
        >
          Facturas
        </Typography>
        <Grid container spacing={1}>
          {facturas.map((factura, idx) => {
            // Determine grid size based on the number of items
            const gridSize =
              Math.floor(12 / facturas.length) > 0
                ? Math.floor(12 / facturas.length)
                : 1;

            return (
              <Grid item xs={12} md={gridSize} lg={gridSize} key={idx}>
                <FacturaCard
                  factura={factura}
                  vendedor={vendedor}
                  cliente={cliente}
                />
              </Grid>
            );
          })}
        </Grid>
        <Select
          value={metodoPago1}
          onChange={(event) => setMetodoPago(event.target.value)}
        >
          <MenuItem value="Efectivo">Efectivo</MenuItem>
          <MenuItem value="Tarjeta">Tarjeta</MenuItem>
        </Select>
        <Button
          color="primary"
          onClick={() => {
            if (window.confirm("¿Estás seguro que deseas cerrar la venta?")) {
              cerrarVenta(metodoPago1);
              setModalOpen(false);
            }
          }}
          sx={{ marginLeft: "1rem", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Finalizar Venta
        </Button>
      </Card>
    </Modal>
  );
};


const Ventas = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [ventaExistente, setVentaExistente] = useState(false); // Variable para saber si la venta ya existe o no
  const [ventaActual, setVentaActual] = useState(null);
  const { idMesa } = useParams();  
  const [modalOpen, setModalOpen] = useState(false);
  const [cuentas, setCuentas] = useState([]);
  const [facturarOpen, setFacturarOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const clientePrueba = {
    id: 1,
    nombre: "Cliente",
  };

  const navigate = useNavigate();
  

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleMostrarFacturar = () => {
    setFacturarOpen(true);
  };

  const handleFacturarClose = () => {
    setFacturarOpen(false);
  };

  const obtenerVentaExistente = () => {
    axios
      .get(`${BaseUrl}/api/Ventas/mesa/${idMesa}`)
      .then((res) => {
        if (res.data.length > 0) {
          // Verificamos si hay datos en la respuesta
          console.log("Venta existente: ", res.data);
          setVentaExistente(true);
          setCarrito(
            res.data.map((detalle) => {
              // Transformamos los detalles de la venta en el formato del carrito
              return {
                id: detalle.productoId,
                productoId: detalle.productoId,
                nombre: detalle.producto.nombre,
                precio: detalle.producto.precio,
                cantidad: detalle.cantidad,
              };
            })
          );
        } else {
          setVentaExistente(false);
          setCarrito([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setVentaExistente(false);
        setCarrito([]);
      });
  };

  const obtenerVentaMesa = () => {
    axios
      .get(`${BaseUrl}/api/Ventas/mesa/${idMesa}/venta`)
      .then((res) => {
        if (res.data) {
          console.log("Venta de la mesa: ", res.data);
          setVentaActual(res.data);
        } else {
          setVentaActual(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setVentaActual(null);
      });
  };

  useEffect(() => {
    axios
      .get(`${BaseUrl}/Categorias`)
      .then((response) => setCategorias(response.data))
      .catch((err) => console.error(err));

    axios
      .get(`${BaseUrl}/Clientes`)
      .then((response) => setClientes(response.data))
      .catch((err) => console.error(err));

    obtenerVentaExistente();
    obtenerVentaMesa();
  }, []);

  const handleCategoryClick = (id) => {
    axios
      .get(`${BaseUrl}/Productos/ByCategoria/${id}`)
      .then((response) => setProductos(response.data))
      .catch((err) => console.error(err));
  };

  const handleAddToCart = (producto, cantidad) => {
    setCarrito((prevCart) => {
      const productInCart = _.find(prevCart, ["id", producto.id]);
      if (productInCart) {
        return prevCart.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prevCart, { ...producto, cantidad }];
      }
    });
  };

  const handleRemoveFromCart = (producto) => {
    setCarrito((prevCart) =>
      prevCart.filter((item) => item.id !== producto.id)
    );
    toast.error(`El producto ${producto.nombre} ha sido eliminado de la cuenta.`);
  };

  const handleSelectCliente = (event) => {
    setSelectedCliente(event.target.value);
  };

  const addDetalleVentas = (ventaId) => {
    carrito.forEach((producto) => {
      const detalleVenta = {
        ProductoId: producto.id,
        Cantidad: producto.cantidad,
        mesaId: parseInt(idMesa),
      };

      console.log("Detalle de venta: ", detalleVenta);

      axios
        .post(`${BaseUrl}/api/Ventas/${ventaId}/productos`, detalleVenta)
        .then(() => console.log("Detalle de venta añadido."))
        .catch((err) => console.error(err));
    });

    axios.post(`${BaseUrl}/api/Cuentas`, {
      VentaId: ventaId,
      Total: _.sumBy(carrito, (item) => item.precio * item.cantidad),
    });
    toast.success("La venta ha sido creada.");
  };

  const updateDetalleVentasFromCart = (venta, carrito) => {
    const detalleVentaIDs = venta.detalleVentas.map((detalle) => detalle.productoId);
    console.log("Detalle de venta IDs: ", detalleVentaIDs);
    console.log("Carrito: ", carrito);
    venta.detalleVentas.forEach((detalle) => {
      const productoEnCarrito = carrito.find(
        (producto) => producto.id === detalle.productoId
      );
      if (productoEnCarrito) {
        // Actualiza la cantidad del detalle de venta si el producto aún está en el carrito
        const detalleVenta = {
          ProductoId: productoEnCarrito.id,
          Cantidad: productoEnCarrito.cantidad,
          cuentaId: venta.cuentas[0].id,
        };

        console.log("Detalle de venta: ", detalleVenta);

        axios
          .put(
            `${BaseUrl}/api/Ventas/${venta.id}/productos/${detalle.id}`,
            detalleVenta
          )
          .then(() => {
            console.log("Detalle de venta actualizado.");
          })
          .catch((err) => console.error(err));

          axios.put(`${BaseUrl}/api/Cuentas/${venta.cuentas[0].id}`, {
            Total: _.sumBy(carrito, (item) => item.precio * item.cantidad),
          });
      } else {
        // Si el producto no está en el carrito, borra el detalle de venta
        axios
          .delete(
            `https://localhost:7100/api/Ventas/${venta.id}/productos/${detalle.id}`
          )
          .then(() => console.log("Detalle de venta eliminado."))
          .catch((err) => console.error(err));

          axios.put(`${BaseUrl}/api/Cuentas/${venta.cuenta.id}`, {
            Total: _.sumBy(carrito, (item) => item.precio * item.cantidad),
          });
      }
    }
    );

    // Para los nuevos productos en el carrito, añade nuevos detalles de venta
    console.log("Carrito: ", carrito);
    carrito.forEach((producto) => {
      console.log("Producto: ", producto);
      if (!detalleVentaIDs.includes(producto.id)) {
        console.log("Producto no encontrado en detalles de venta.");
        const detalleVenta = {
          ProductoId: producto.id,
          Cantidad: producto.cantidad,
          mesaId: venta.mesaId,
          cuentaId: venta.cuentas[0].id,
        };

        console.log("Detalle de venta: ", detalleVenta);

        axios
          .post(`${BaseUrl}/api/Ventas/${venta.id}/productos`, detalleVenta)
          .then(() => console.log("Detalle de venta añadido."))
          .catch((err) => console.error(err));
      }
    });
    toast.success("La venta ha sido actualizada.");
  };


  const handleGuardarVenta = () => {
    const venta = {
      usuarioId: user.id,
      clienteId: ventaActual ? ventaActual.clienteId : selectedCliente,
      estado: "En Proceso",
      mesaId: parseInt(idMesa),
      metodoPago: metodoPago,
      fecha: new Date(),
    };

    console.log("Venta: ", venta);

    if (ventaExistente) {
      axios
        .put(`${BaseUrl}/api/Ventas/${ventaActual.id}`, venta)
        .then(() => {
          console.log("Venta actualizada.");
          updateDetalleVentasFromCart(ventaActual, carrito); // Llama a addDetalleVentas con el ID de la venta actualizada
        })
        .catch((err) => console.error(err));
    } 

    if (!ventaExistente) {
      axios
        .post(`${BaseUrl}/api/Ventas`, venta)
        .then((res) => {
          console.log("Venta creada.");
          addDetalleVentas(res.data.id); // Llama a addDetalleVentas con el ID de la venta creada
        })
        .catch((err) => console.error(err));
    }
  };


const handleVentaFinalizada = async (metodoPago1) => {
  try {
    // Crear una notificación toast y esperar a que termine
    await toast.promise(
      axios.put(`${BaseUrl}/api/Ventas/${ventaActual.id}`, {
        ...ventaActual,
        estado: "Finalizada",
        metodoPago: metodoPago1,
      }),
      {
        success: "Venta finalizada",
        error: "Error al finalizar la venta",
      }
    );

    console.log("Venta finalizada.");

    // Cambiar el estado de la mesa a "Libre"
    await axios.put(`${BaseUrl}/Mesas/${idMesa}`, {
      id: idMesa,
      estado: "Libre",
      ventas: [],
      facturas: [],
    });
    console.log("Mesa liberada.");

    // Refrescar las mesas y redirigir a /mesas
    navigate("/mesas");
  } catch (error) {
    console.error("Error al finalizar la venta y liberar la mesa", error);
    toast.error("Error al finalizar la venta y liberar la mesa");
  }
};


  return (
    <ThemeProvider theme={theme}>
      <Container>
        <ToastContainer />
        <Grid
          container
          spacing={4}
          sx={{
            border: "1px solid #8ccf9c",
            borderRadius: "5px",
            padding: "2rem",
            mt: "2rem",
          }}
        >
          <Grid item xs={12} sm={8}>
            {categorias.map((categoria) => (
              <Button
                variant="contained"
                key={categoria.id}
                onClick={() => handleCategoryClick(categoria.id)}
                sx={{ mr: 2, mb: 2 }}
              >
                {categoria.nombre}
              </Button>
            ))}
            <Grid container spacing={1} sx={{ my: 2, pr: 2 }}>
              {productos.map((producto) => (
                <Grid item key={producto.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      my: 2,
                      borderColor: "#8ccf9c",
                      borderWidth: "2px",
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {producto.nombre}
                      </Typography>
                      <Typography>{producto.descripcion}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        color="primary"
                        onClick={() => handleAddToCart(producto, 1)}
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ borderLeft: "1px solid #8ccf9c" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 2, fontSize: "1.2rem" }}
            >
              Vendedor: {user.nombre}
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              Cliente:
            </Typography>
            <Select
              value={
                ventaActual ? ventaActual.clienteId : selectedCliente || ""
              }
              onChange={handleSelectCliente}
              fullWidth
              sx={{ mb: 2 }}
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </MenuItem>
              ))}
            </Select>
            <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {carrito.map((producto, idx) => (
                <div key={idx} sx={{ my: 2 }}>
                  <Typography>
                    || {producto.nombre} || x{producto.cantidad} = ${" "}
                    {producto.precio * producto.cantidad} ||
                  </Typography>
                  <IconButton
                    color="secondary"
                    onClick={() => handleRemoveFromCart(producto)}
                  >
                    <RemoveShoppingCartIcon />
                  </IconButton>
                </div>
              ))}
            </div>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mt: 5, mb: 2 }}
            >
              Total: $ {_.sumBy(carrito, (item) => item.precio * item.cantidad)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, width: "50%" }}
              onClick={handleOpenModal}
            >
              Dividir Cuenta
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ mb: 2, width: "50%" }}
              onClick={handleGuardarVenta}
            >
              Guardar
            </Button>
            <DividirCuenta
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              carrito={carrito}
              setCuentas={setCuentas}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ mb: 2, width: "100%" }}
              onClick={handleMostrarFacturar}
            >
              Facturar
            </Button>
                <Facturar
                  vendedor={user}
                  cliente={clientePrueba}
                  cuentas={cuentas}
                  carrito={carrito}
                  modalOpen={facturarOpen}
                  setModalOpen={handleFacturarClose}
                  cerrarVenta={handleVentaFinalizada}
                  setMetodoPago={setMetodoPago}
                  metodoPago1={metodoPago}
                />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Ventas;
