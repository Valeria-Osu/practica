import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/styles.css'; // Importando el archivo CSS con los estilos globales

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
    <div className="register-container">
      <h2>Registro</h2>
      
      {/* Formulario de registro */}
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>

      {/* Enlace para redirigir al Login si el usuario ya tiene cuenta */}
      <p className="link-container">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="link">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

export default Register;
