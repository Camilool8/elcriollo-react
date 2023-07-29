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
import "./Categorias.css";
import { BaseUrl } from "../services/apiUrl";

function Categorias() {
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    <div className="category-container row g-3">
      {user && user.rol === "Administrador" && (
        <div className="category-form-container p-4 bg-light rounded-3 shadow">
          <h2 className="mb-4">Añadir / Editar Categoría</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                {...register("nombre")}
                placeholder="Nombre"
                className="form-control form-input"
              />
            </div>
            <div className="d-flex justify-content-between">
              <div className="btn-group">
                <button type="submit" className="btn btn-outline-primary">
                  {selectedCategory ? (
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
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={deselectCategory}
                    className="btn btn-outline-secondary"
                  >
                    <BsX />
                    Deseleccionar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      <div
        className={
          user && user.rol === "Administrador"
            ? "category-list-container p-4 bg-light rounded-3 shadow"
            : "category-list-container-full p-4 bg-light rounded-3 shadow"
        }
      >
        <h2 className="mb-4">Lista de Categorías</h2>
        <input
          type="text"
          className="form-control form-input mb-4"
          placeholder="Buscar..."
          onChange={handleSearch} 
        />
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                {user && user.rol === "Administrador" && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3">Cargando categorías...</td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className={`${
                      selectedCategory?.id === category.id ? "table-success" : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <td>{category.nombre}</td>
                    {user && user.rol === "Administrador" && (
                      <td>
                        <BsPencilSquare
                          onClick={() => setSelectedCategory(category)}
                          className="me-2 text-warning cursor-pointer"
                        />
                        <BsFillTrashFill
                          onClick={(e) => {
                            e.stopPropagation();
                            mutationDelete.mutate(category.id);
                            }}
                            className="text-danger cursor-pointer"
                            />
                            </td>
                            )}
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

export default Categorias;
