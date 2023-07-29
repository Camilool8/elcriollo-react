import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  BsFillTrashFill,
  BsPencilSquare,
  BsPlus,
  BsX,
  BsArrowCounterclockwise,
} from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Productos.css";
import { BaseUrl } from "../services/apiUrl";

function Productos() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();

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
    <div className="product-container row g-3">
      {user && user.rol === "Administrador" && (
        <div className="product-form-container p-4 bg-light rounded-3 shadow">
          <h2 className="mb-4">Añadir / Editar Producto</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Codigo</label>
              <input
                {...register("codigo")}
                placeholder="Codigo"
                className="form-control form-input"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                {...register("nombre")}
                placeholder="Nombre"
                className="form-control form-input"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                {...register("precio")}
                placeholder="Precio"
                className="form-control form-input"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cantidad</label>
              <input
                {...register("cantidad")}
                placeholder="Cantidad"
                className="form-control form-input"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoria</label>
              <select
                {...register("categoriaId")}
                className="form-select form-input"
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-outline-primary">
                {selectedProduct ? (
                  <>
                    <BsPencilSquare />
                    Editar
                  </>
                ) : (
                  <>
                    <BsPlus />
                    Crear
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="btn btn-outline-danger"
              >
                <BsArrowCounterclockwise />
                Limpiar
              </button>
              {selectedProduct && (
                <button
                  type="button"
                  onClick={deselectProduct}
                  className="btn btn-outline-secondary"
                >
                  <BsX />
                  Deseleccionar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div
        className={
          user && user.rol === "Administrador"
            ? "product-list-container p-4 bg-light rounded-3 shadow"
            : "product-list-container-full p-4 bg-light rounded-3 shadow"
        }
      >
        <h2 className="mb-4">Lista de Productos</h2>
        <input
          type="text"
          className="form-control form-input mb-4"
          placeholder="Buscar..."
          onChange={handleSearch} // Add onChange to capture user input
        />
        <div className="table-container">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Categoria</th>
                {user && user.rol === "Administrador" && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`${
                    selectedProduct?.id === product.id ? "table-success" : ""
                  }`}
                >
                  <td>{product.codigo}</td>
                  <td>{product.nombre}</td>
                  <td>{product.precio}</td>
                  <td>
                    {
                      inventarios.find((inv) => inv.productoId === product.id)
                        ?.cantidad
                    }
                  </td>
                  <td>
                    {
                      categorias.find((cat) => cat.id === product.categoriaId)
                        ?.nombre
                    }
                  </td>
                  {user && user.rol === "Administrador" && (
                    <td>
                      <BsPencilSquare
                        onClick={() => setSelectedProduct(product)}
                        className="me-2 text-warning cursor-pointer"
                      />

                      <BsFillTrashFill
                        onClick={(e) => {
                          e.stopPropagation();
                          mutationDelete.mutate(product.id);
                        }}
                        className="text-danger cursor-pointer"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Productos;
