// /src/services/authService.js
import axios from "axios";
import { BaseUrl } from "./apiUrl";

// URL de tu API
const API_URL =  `${BaseUrl}/Accounts/`;

async function registerUser(user) {
  try {
    const response = await axios.post(API_URL + "register", user);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    throw error;
  }
}

const loginUser = async (user) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/Accounts/login`,
      user
    );
    if (response.data) {
      // get the token from the response data
      const token = response.data;
      // save the token in the local storage
      localStorage.setItem("userToken", token);
      // make another axios request to the validate-token route with the token
      const response2 = await axios.get(
        `${BaseUrl}/Accounts/validate-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response2.data) {
        // get the user data from the response2 data
        return response2.data;
      } else {
        throw new Error("Invalid response");
      }
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    throw error;
  }
};

function logoutUser() {
  // Eliminar el token del local storage al cerrar sesión
  localStorage.removeItem("userToken");
}

function getToken() {
  // Obtener el token del local storage
  return localStorage.getItem("userToken");
}

export { registerUser, loginUser, logoutUser, getToken };
