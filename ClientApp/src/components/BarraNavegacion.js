import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import {
  FaUsers,
  FaHamburger,
  FaBeer,
  FaUserTie,
  FaSignOutAlt,
  FaTools,
  FaList,
  FaChartBar,
  FaUsersCog,
} from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./BarraNavegacion.css";
import logo from "../images/2.png";

const BarraNavegacion = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar navbar-style d-flex justify-content-start align-items-center">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="nav-buttons">
        <Link className="btn nav-button" to="/clientes">
          <FaUsers size={40} /> Clientes
        </Link>
        <Link className="btn nav-button" to="/productos">
          <FaHamburger size={40} /> Productos
        </Link>
        <Link className="btn nav-button" to="/mesas">
          <FaBeer size={40} /> Mesas
        </Link>
        {user?.rol === "Administrador" && (
          <>
            <Link className="btn nav-button" to="/categorias">
              <FaList size={40} /> Categorias
            </Link>
            <Link className="btn nav-button" to="/reportes">
              <FaChartBar size={40} /> Reportes
            </Link>
            <Link className="btn nav-button" to="/usuarios">
              <FaUsersCog size={40} /> Usuarios
            </Link>
          </>
        )}
      </div>
      <Dropdown className="user-dropdown">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className="navbar-user-info"
        >
          {user ? (
            <>
              <span>
                <FaUserTie size={32} /> {user.nombre}
              </span>
            </>
          ) : (
            <span>Usuario</span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item disabled>
            <FaUserTie size={20} /> {user ? user.nombre : "Nombre"}
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <FaTools size={20} /> {user ? user.rol : "Rol"}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            <FaSignOutAlt size={20} /> Salir
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default BarraNavegacion;
