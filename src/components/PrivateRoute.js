import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  // Obtener el token JWT desde localStorage
  const token = localStorage.getItem("token");

  // Si no hay token, redirigir al login
  return !token ? <Navigate to="/login" /> : children;
}

export default PrivateRoute;
