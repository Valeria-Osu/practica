import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState(""); // Para almacenar el correo
  const [password, setPassword] = useState(""); // Para almacenar la contraseña
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Lógica para registrar al usuario (esto se puede conectar más tarde con la API)
    console.log("Correo:", email);
    console.log("Contraseña:", password);
    
    // Aquí deberías agregar la lógica para registrarse, como la llamada a la API

    // Si todo está bien, redirige al Login
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Registro</h2>
      
      {/* Formulario de registro */}
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Registrarse</button>
      </form>

      {/* Enlace para redirigir al Login si el usuario ya tiene cuenta */}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}

export default Register;
