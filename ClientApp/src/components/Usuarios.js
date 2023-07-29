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
import "./Usuarios.css";
import { BaseUrl } from "../services/apiUrl";

function Usuarios() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, loading, getToken } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryuser = useQueryClient();

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
      <div className="user-container row g-3">
        {user && user.rol === "Administrador" && (
          <div className="user-form-container p-4 bg-light rounded-3 shadow">
            <h2 className="mb-4">Añadir / Editar Usuario</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  {...register("nombre")}
                  placeholder="Nombre"
                  className="form-control form-input"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="form-control form-input"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <input
                  {...register("rol")}
                  placeholder="Rol"
                  className="form-control form-input"
                />
              </div>
                <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                    {...register("contraseña")}
                    placeholder="Contraseña"
                    type="password"
                    className="form-control form-input"
                />
                </div>
              <div className="d-flex justify-content-between">
                <div className="btn-group">
                  <button type="submit" className="btn btn-outline-primary">
                    {selectedUser ? (
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
                  {selectedUser && (
                    <button
                      type="button"
                      onClick={deselectUser}
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
              ? "user-list-container p-4 bg-light rounded-3 shadow"
              : "user-list-container-full p-4 bg-light rounded-3 shadow"
          }
        >
          <h2 className="mb-4">Lista de usuarios</h2>
          <input
            type="text"
            className="form-control form-input mb-4"
            placeholder="Buscar..."
            onChange={handleSearch} // Add onChange to capture user input
          />
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  {user && user.rol === "Administrador" && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4">Cargando useres...</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`${
                        selectedUser?.id === user.id ? "table-success" : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{user.rol}</td>
                      
                        <td>
                          <BsPencilSquare
                            onClick={() => setSelectedUser(user)}
                            className="me-2 text-warning cursor-pointer"
                          />
                          <BsFillTrashFill
                            onClick={(e) => {
                              e.stopPropagation();
                              mutationDelete.mutate(user.id);
                            }}
                            className="text-danger cursor-pointer"
                          />
                        </td>
                      
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
    

export default Usuarios;
