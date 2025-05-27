// src/pages/Perfil.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import "./Perfil.css";

const Perfil = () => {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState(user?.displayName || "");
  const [fotoURL, setFotoURL] = useState(user?.photoURL || "");
  const [mensaje, setMensaje] = useState("");

  const handleGuardar = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: nombre,
        photoURL: fotoURL,
      });
      setMensaje("Perfil actualizado correctamente");
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
        />

        <label>Correo electrónico</label>
        <input type="email" value={user?.email} disabled />

        <label>Foto de perfil (URL)</label>
        <input
          type="text"
          value={fotoURL}
          onChange={(e) => setFotoURL(e.target.value)}
        />

        {fotoURL && (
          <img src={fotoURL} alt="Foto de perfil" className="foto-preview" />
        )}

        <button onClick={handleGuardar}>Guardar Cambios</button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Perfil;
