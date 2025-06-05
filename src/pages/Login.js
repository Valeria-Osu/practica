import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/styles.css';

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:44324/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NombreUsuario: nombreUsuario, Contrasena: password })
      });

      const data = await response.json();

      if (response.ok && data && data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token || 'fake-token');
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        setError(data.message || "Nombre de usuario o contraseña incorrectos");
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
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
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

      {error && <p className="error-message">{error}</p>}

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