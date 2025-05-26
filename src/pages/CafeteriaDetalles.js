import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import cafeteriasData from "../data/cafeterias.json";
import { AuthContext } from "../context/AuthContext";

const CafeteriaDetalles = () => {
  const { id } = useParams();
  const cafeteria = cafeteriasData.find(c => c.id === parseInt(id));
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  if (!cafeteria) return <p>Cafetería no encontrada</p>;

  const handleReseña = () => {
    console.log("Abriendo formulario de reseña...");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2>{cafeteria.nombre}</h2>
      <img
        src={cafeteria.imagen}
        alt={cafeteria.nombre}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
      />
      <p><strong>Dirección:</strong> {cafeteria.direccion}</p>
      <p><strong>Descripción:</strong> {cafeteria.descripcion}</p>
      <p><strong>Servicios:</strong> {cafeteria.servicios.join(", ")}</p>

      {user ? (
        <button onClick={handleReseña} style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6f4e37",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "1rem"
        }}>
          Escribir reseña
        </button>
      ) : (
        <p style={{ marginTop: "1rem" }}>
          <Link to="/login">Inicia sesión</Link> para dejar una reseña.
        </p>
      )}

      <Link to="/" style={{ display: "inline-block", marginTop: "2rem", color: "#6f4e37", textDecoration: "none" }}>
        ← Volver al catálogo
      </Link>
    </div>
  );
};

export default CafeteriaDetalles;