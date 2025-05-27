import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import cafeteriasData from "../data/cafeterias.json";
import { AuthContext } from "../context/AuthContext";

const CafeteriaDetalles = () => {
  const { id } = useParams();
  const cafeteria = cafeteriasData.find(c => c.id === parseInt(id));
  const { user, loading } = useContext(AuthContext);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [resenas, setResenas] = useState([]); // Estado local de reseñas

  if (loading) return <p>Cargando...</p>;
  if (!cafeteria) return <p>Cafetería no encontrada</p>;

  const handleMostrarFormulario = () => setMostrarFormulario(true);

  const handleEnviarResena = (e) => {
    e.preventDefault();

    if (puntuacion < 1 || puntuacion > 5) {
      alert("La puntuación debe ser entre 1 y 5");
      return;
    }

    const nuevaResena = {
      puntuacion,
      comentario,
      usuario: user.nombre,
    };

    setResenas([...resenas, nuevaResena]);
    setPuntuacion(5);
    setComentario("");
    setMostrarFormulario(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>{cafeteria.nombre}</h2>
      {cafeteria.imagen && (
        <img
          src={cafeteria.imagen}
          alt={cafeteria.nombre}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
        />
      )}
      
      <h3 style={{ marginTop: "1.5rem" }}>Menú</h3>
      <ul>
        {cafeteria.menu.map((item, index) => (
          <li key={index}>
            {item.nombre} - ${item.precio.toFixed(2)}
          </li>
        ))}
      </ul>

      {/* Botón para gestión de menú (solo admin) */}
      {user?.rol === "admin" && (
        <p style={{ marginTop: "1rem" }}>
          <Link
            to={`/cafeteria/${cafeteria.id}/gestion-menu`}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6f4e37",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px"
            }}
          >
            Editar menú
          </Link>
        </p>
      )}

      <h3 style={{ marginTop: "2rem" }}>Reseñas</h3>
      {resenas.length > 0 ? (
        resenas.map((r, index) => (
          <div key={index} style={{ marginBottom: "1rem", backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
            <p><strong>{r.usuario}</strong> - {r.puntuacion}⭐</p>
            <p>{r.comentario}</p>
          </div>
        ))
      ) : (
        <p>No hay reseñas aún.</p>
      )}

      {user ? (
        <>
          <button
            onClick={handleMostrarFormulario}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6f4e37",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1.5rem"
            }}
          >
            Escribir reseña
          </button>

          {mostrarFormulario && (
            <form onSubmit={handleEnviarResena} style={{ marginTop: "1rem", backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
              <label>
                Puntuación (1 a 5):
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={puntuacion}
                  onChange={(e) => setPuntuacion(parseInt(e.target.value))}
                  style={{ marginLeft: "0.5rem", width: "3rem" }}
                  required
                />
              </label>
              <br />
              <label style={{ display: "block", marginTop: "1rem" }}>
                Comentario:
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows="4"
                  style={{ display: "block", width: "100%", marginTop: "0.5rem" }}
                  required
                />
              </label>
              <button
                type="submit"
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#6f4e37",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Enviar reseña
              </button>
            </form>
          )}
        </>
      ) : (
        <p style={{ marginTop: "1.5rem" }}>
          <Link to="/login">Inicia sesión</Link> para dejar una reseña.
        </p>
      )}

      <p style={{ marginTop: "2rem" }}>
        <Link to="/">← Volver al catálogo</Link>
      </p>
    </div>
  );
};

export default CafeteriaDetalles;
