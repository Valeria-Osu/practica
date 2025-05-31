import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.js"; // Asegúrate de que el Header esté correctamente importado
import '../styles/styles.css'; // Importando el archivo CSS con los estilos globales

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
      <div className="container">
        <h2>{cafeteria.nombre}</h2>
        {cafeteria.imagen && (
          <img
            src={cafeteria.imagen}
            alt={cafeteria.nombre}
            className="cafeteria-image"
          />
        )}

        <h3>Menú</h3>
        <ul className="menu-list">
          {menu.map((item, index) => (
            <li key={index}>
              {item.nombre} - ${item.precio.toFixed(2)}
            </li>
          ))}
        </ul>

        {/* Botón para gestión de menú (solo admin) */}
        {user?.rol === "admin" && (
          <p>
            <Link to={`/cafeteria/${cafeteria.id}/gestion-menu`} className="button">
              Editar menú
            </Link>
          </p>
        )}

        <h3>Reseñas</h3>
        {resenas.length > 0 ? (
          resenas.map((r, index) => (
            <div key={index} className="review-card">
              <p><strong>{r.usuario}</strong> - {r.puntuacion}⭐</p>
              <p>{r.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay reseñas aún.</p>
        )}

        {/* Mostrar mensaje de error o éxito */}
        {mensaje && <p className="error-message">{mensaje}</p>}

        {user ? (
          <>
            <button onClick={handleMostrarFormulario} className="button">
              Escribir reseña
            </button>

            {mostrarFormulario && (
              <form onSubmit={handleEnviarResena} className="review-form">
                <label>
                  Puntuación (1 a 5):
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(parseInt(e.target.value))}
                    required
                  />
                </label>
                <br />
                <label>
                  Comentario:
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows="4"
                    required
                  />
                </label>
                <button type="submit" className="button">
                  Enviar reseña
                </button>
              </form>
            )}
          </>
        ) : (
          <p>
            <Link to="/login">Inicia sesión</Link> para dejar una reseña.
          </p>
        )}

        <p>
          <Link to="/">← Volver al catálogo</Link>
        </p>
      </div>
    </div>
  );
};

export default CafeteriaDetalles;
