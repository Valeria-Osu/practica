import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.js"; // Asegúrate de que el Header esté correctamente importado

const CafeteriaDetalles = () => {
  const { id } = useParams();
  const [cafeteria, setCafeteria] = useState(null);
  const [menu, setMenu] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState(""); // Utilizado para mostrar mensajes
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // aqui te dice si se obtiene el token JWT desde localStorage (si está disponible)
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("usuario")) : null; // Obtener el usuario desde localStorage si está autenticado

  useEffect(() => {
    // cafeteria desde el backend
    const fetchCafeteria = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cafeteria/${id}`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          }
        });
        const data = await response.json();
        if (response.status === 200) {
          setCafeteria(data.cafeteria);
          setMenu(data.cafeteria.menu);
          setResenas(data.cafeteria.reseñas);
        } else {
          setMensaje("Error al obtener los detalles de la cafetería.");
        }
        setLoading(false);
      } catch (error) {
        setMensaje("Hubo un error al obtener los detalles de la cafetería.");
        setLoading(false);
      }
    };

    fetchCafeteria();
  }, [id, token]);

  const handleMostrarFormulario = () => setMostrarFormulario(true);

  const handleEnviarResena = async (e) => {
    e.preventDefault();

    if (puntuacion < 1 || puntuacion > 5) {
      alert("La puntuación debe ser entre 1 y 5");
      return;
    }

    if (!token) {
      // Si el usuario no está autenticado, redirigirlo al login
      navigate("/login");
      return;
    }

    const nuevaResena = {
      puntuacion,
      comentario,
      usuario: user ? user.nombre : "Desconocido", // Si no hay usuario, asignamos "Desconocido"
    };

    try {
      const response = await fetch(`http://localhost:5000/cafeterias/${id}/reseñas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaResena),
      });

      const data = await response.json();

      if (response.status === 200) {
        setResenas([...resenas, data.resena]);
        setPuntuacion(5);
        setComentario("");
        setMostrarFormulario(false);
      } else {
        setMensaje(data.message || "Error al enviar la reseña.");
      }
    } catch (error) {
      setMensaje("Hubo un error al enviar la reseña.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!cafeteria) return <p>Cafetería no encontrada</p>;

  return (
    <div>
      {/* Header con barra de búsqueda */}
      <Header />

      {/* Contenido de los detalles de la cafetería */}
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
          {menu.map((item, index) => (
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

        {/* Mostrar mensaje de error o éxito */}
        {mensaje && <p style={{ color: "red", fontWeight: "bold" }}>{mensaje}</p>}

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
    </div>
  );
};

export default CafeteriaDetalles;
