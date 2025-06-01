import React from "react";
import "../styles/styles.css";

const CafeteriaModal = ({ cafeteria, onClose }) => {
  if (!cafeteria) return null;

  return (
    <div className="cafeteria-detalles-modal">
      <div className="cafeteria-detalles-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{cafeteria.nombre}</h2>
        <img
          src={cafeteria.imagen || "default_image.jpg"}
          alt={cafeteria.nombre}
          style={{ maxWidth: "100%", borderRadius: "12px", marginBottom: "1rem" }}
        />
        <p>{cafeteria.descripcion}</p>
        <p><b>Zona:</b> {cafeteria.zona}</p>
        <p><b>Servicios:</b> {Array.isArray(cafeteria.servicios) ? cafeteria.servicios.join(", ") : cafeteria.servicios}</p>
        <p><b>Menú:</b> {Array.isArray(cafeteria.menu) ? cafeteria.menu.join(", ") : cafeteria.menu}</p>
      </div>
    </div>
  );
};

export default CafeteriaModal;