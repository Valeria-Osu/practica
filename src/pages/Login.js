import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/styles.css'; // Importando el archivo CSS con los estilos globales

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para manejar errores de login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar solicitud POST a la API de backend para verificar las credenciales
      const response = await fetch('http://localhost:5000/login', {  // Asegúrate de que esta URL sea la de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Si el login es exitoso, guardar el token en localStorage
        localStorage.setItem('token', data.token);  // Guarda el token JWT en el localStorage

        alert("Inicio de sesión exitoso");
        navigate("/dashboard"); // Redirigir al Dashboard
      } else {
        setError(data.message); // Mostrar mensaje de error si el login falla
      }
    } catch (error) {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">Entrar</button>
      </form>

      {/* Error de login */}
      {error && <p className="error-message">{error}</p>}

      {/* Enlace a registro */}
      <p className="register-link">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default Login;
