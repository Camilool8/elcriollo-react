// src/components/Login.js
import React, { useState, useContext } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "./Login.css";
import logo from "../images/3.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user, loading, login } = useContext(AuthContext); // use user and loading state from context

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if email and password are not empty
    if (!email || !password) {
      setError("Por favor ingrese su email y contraseña");
      return;
    }

    try {
      await login({ Email: email, Contraseña: password });
      navigate("/clientes");
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  // clear error state when email or password changes
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  // redirect to /clientes if user is already logged in
  if (user) {
    navigate("/clientes");
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <img src={logo} alt="Restaurant Logo" />
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su email"
              value={email}
              onChange={handleChangeEmail}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={handleChangePassword}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
