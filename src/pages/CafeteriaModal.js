import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const CafeteriaModal = ({ cafeteria, onClose }) => {
  if (!cafeteria) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content cafeteria-detalles-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">{cafeteria.nombre || cafeteria.nombreCafeteria}</h2>
        <img
          src={cafeteria.imagenURL || cafeteria.imagen || "default_image.jpg"}
          alt={cafeteria.nombre || cafeteria.nombreCafeteria}
          className="modal-image"
        />
        <div className="modal-info">
          <p><b>Zona:</b> {cafeteria.zona}</p>
          <p><b>Ubicación:</b> {cafeteria.ubicacion}</p>
          {cafeteria.descripcion && <p><b>Descripción:</b> {cafeteria.descripcion}</p>}
          {cafeteria.horarios && <p><b>Horario:</b> {cafeteria.horarios}</p>}
          {cafeteria.tipoServicio && <p><b>Servicios:</b> {cafeteria.tipoServicio}</p>}
          {cafeteria.telefono && <p><b>Teléfono:</b> {cafeteria.telefono}</p>}
          {cafeteria.detalles && <p><b>Detalles adicionales:</b> {cafeteria.detalles}</p>}
        </div>
        <Link
          to={`/cafeteria/${cafeteria.id}`}
          className="button"
          style={{ marginTop: "15px" }}
          onClick={onClose}
        >
          Ver página de detalles
        </Link>
      </div>
    </div>
  );
};

export default CafeteriaModal;