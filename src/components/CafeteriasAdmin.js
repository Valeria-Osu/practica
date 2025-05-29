import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cafeteriasData from "../data/cafeterias.json"; // Si estás usando datos locales, si no, conecta con la API
import "./CafeteriasAdmin.css";

const CafeteriasAdmin = () => {
  const [cafeterias, setCafeterias] = useState(cafeteriasData); // Usar datos locales para pruebas
  const [editando, setEditando] = useState(null);
  const [nuevaCafeteria, setNuevaCafeteria] = useState({
    nombre: "",
    direccion: "",
    descripcion: "",
    imagen: "",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Obtener el usuario del localStorage
  const user = JSON.parse(localStorage.getItem("usuario"));

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/"); // Si no es administrador, redirigir al inicio
    }
  }, [navigate, user]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setNuevaCafeteria({ ...nuevaCafeteria, [e.target.name]: e.target.value });
  };

  // Función para agregar una cafetería
  const handleAgregar = async () => {
    try {
      const response = await fetch("http://localhost:5000/cafeterias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCafeteria),
      });

      const data = await response.json();
      if (response.status === 200) {
        setCafeterias([...cafeterias, data.cafeteria]); // Agregar nueva cafetería a la lista
        setNuevaCafeteria({ nombre: "", direccion: "", descripcion: "", imagen: "" });
        setMensaje("Cafetería agregada correctamente.");
      } else {
        setMensaje(data.message || "Error al agregar cafetería.");
      }
    } catch (error) {
      setMensaje("Hubo un error al agregar la cafetería.");
    }
  };

  // Función para editar una cafetería
  const handleEditar = (index) => {
    setEditando(index);
    setNuevaCafeteria({ ...cafeterias[index] });
  };

  // Función para guardar cambios en una cafetería
  const handleGuardar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/cafeterias/${cafeterias[editando].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCafeteria),
      });

      const data = await response.json();
      if (response.status === 200) {
        const actualizadas = [...cafeterias];
        actualizadas[editando] = nuevaCafeteria;
        setCafeterias(actualizadas);
        setEditando(null);
        setNuevaCafeteria({ nombre: "", direccion: "", descripcion: "", imagen: "" });
        setMensaje("Cafetería actualizada correctamente.");
      } else {
        setMensaje(data.message || "Error al actualizar la cafetería.");
      }
    } catch (error) {
      setMensaje("Hubo un error al actualizar la cafetería.");
    }
  };

  // Función para eliminar una cafetería
  const handleEliminar = async (index) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cafetería?")) return;

    try {
      const response = await fetch(`http://localhost:5000/cafeterias/${cafeterias[index].id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.status === 200) {
        const actualizadas = cafeterias.filter((_, i) => i !== index);
        setCafeterias(actualizadas);
        setMensaje("Cafetería eliminada correctamente.");
      } else {
        setMensaje(data.message || "Error al eliminar la cafetería.");
      }
    } catch (error) {
      setMensaje("Hubo un error al eliminar la cafetería.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Gestión de Cafeterías</h2>
      {mensaje && <p>{mensaje}</p>}

      <ul>
        {cafeterias.map((cafe, index) => (
          <li key={index} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <strong>{cafe.nombre}</strong><br />
            Dirección: {cafe.direccion}<br />
            Descripción: {cafe.descripcion}<br />
            <img src={cafe.imagen} alt={cafe.nombre} style={{ width: "150px", height: "100px", objectFit: "cover", marginTop: "0.5rem" }} /><br />
            <button onClick={() => handleEditar(index)} style={btn}>Editar</button>
            <button onClick={() => handleEliminar(index)} style={btnEliminar}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <h3>{editando !== null ? "Editar Cafetería" : "Agregar Nueva Cafetería"}</h3>
        <label>
          Nombre:
          <input type="text" name="nombre" value={nuevaCafeteria.nombre} onChange={handleChange} required />
        </label><br />
        <label>
          Dirección:
          <input type="text" name="direccion" value={nuevaCafeteria.direccion} onChange={handleChange} required />
        </label><br />
        <label>
          Descripción:
          <textarea name="descripcion" value={nuevaCafeteria.descripcion} onChange={handleChange} required />
        </label><br />
        <label>
          URL de imagen:
          <input type="text" name="imagen" value={nuevaCafeteria.imagen} onChange={handleChange} required />
        </label><br />

        <button onClick={editando !== null ? handleGuardar : handleAgregar} style={btnPrincipal}>
          {editando !== null ? "Guardar Cambios" : "Agregar Cafetería"}
        </button>
      </div>

      <p style={{ marginTop: "2rem" }}>
        <Link to="/">← Volver al inicio</Link>
      </p>
    </div>
  );
};

const btn = {
  marginRight: "0.5rem",
  padding: "0.3rem 0.8rem",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnEliminar = {
  ...btn,
  backgroundColor: "#d9534f",
  color: "white",
};

const btnPrincipal = {
  marginTop: "1rem",
  padding: "0.5rem 1.2rem",
  backgroundColor: "#6f4e37",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default CafeteriasAdmin;
