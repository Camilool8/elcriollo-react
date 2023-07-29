// src/context/authContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import {
  registerUser,
  loginUser,
  logoutUser,
  getToken,
} from "../services/authService";
import { BaseUrl } from "../services/apiUrl";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (user) => {
    const response = await registerUser(user);
    setUser(response);
  };

  const login = async (user) => {
    const response = await loginUser(user);
    setUser(response);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // Asegúrate de tener una ruta en tu backend que valide y devuelva la información del usuario en base al token
          const response = await axios.get(
            `${BaseUrl}/Accounts/validate-token`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          logout(); // En caso de que el token sea inválido o esté expirado
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
