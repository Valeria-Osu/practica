import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css"; // Importando el archivo CSS con los estilos globales

const Perfil = () => {
  const [nombre, setNombre] = useState("");
  const [fotoURL, setFotoURL] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Para almacenar el correo del usuario
  const navigate = useNavigate();

  // Recuperar los datos del usuario desde localStorage (si estás usando JWT)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setNombre(user.displayName || "");
      setFotoURL(user.photoURL || "");
      setUserEmail(user.email);
    } else {
      navigate("/login"); // Si no hay usuario autenticado, redirigir al login
    }
  }, [navigate]);

  // Función para guardar los cambios en el perfil
  const handleGuardar = async () => {
    try {
      // Llamar a la API para actualizar el perfil
      const response = await fetch("http://localhost:5000/actualizar-perfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail, // Usamos el correo del usuario para identificarlo
          displayName: nombre,
          photoURL: fotoURL,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMensaje("Perfil actualizado correctamente");
      } else {
        setMensaje(data.message || "Hubo un error al actualizar tu perfil");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setMensaje("Hubo un error al actualizar tu perfil");
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-form">
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-field"
        />

        <label>Correo electrónico</label>
        <input type="email" value={userEmail} disabled className="input-field" />

        <label>Foto de perfil (URL)</label>
        <input
          type="text"
          value={fotoURL}
          onChange={(e) => setFotoURL(e.target.value)}
          className="input-field"
        />

        {fotoURL && (
          <img src={fotoURL} alt="Foto de perfil" className="foto-preview" />
        )}

        <button onClick={handleGuardar} className="btn btn-primary">
          Guardar Cambios
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Perfil;
