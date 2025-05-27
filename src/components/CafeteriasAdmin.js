import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import cafeteriasData from "../data/cafeterias.json";

const CafeteriasAdmin = () => {
  const { user } = useContext(AuthContext);

  const [cafeterias, setCafeterias] = useState(cafeteriasData);
  const [editando, setEditando] = useState(null);
  const [nuevaCafeteria, setNuevaCafeteria] = useState({
    nombre: "",
    direccion: "",
    descripcion: "",
    imagen: "",
  });

  if (!user || user.rol !== "admin") {
    return <p style={{ padding: "2rem" }}>Acceso denegado. Solo administradores pueden gestionar cafeterías.</p>;
  }

  const handleChange = (e) => {
    setNuevaCafeteria({ ...nuevaCafeteria, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    const nueva = {
      id: cafeterias.length + 1,
      ...nuevaCafeteria,
      menu: [],
      reseñas: [],
    };
    setCafeterias([...cafeterias, nueva]);
    setNuevaCafeteria({ nombre: "", direccion: "", descripcion: "", imagen: "" });
  };

  const handleEditar = (index) => {
    setEditando(index);
    setNuevaCafeteria({ ...cafeterias[index] });
  };

  const handleGuardar = () => {
    const actualizadas = [...cafeterias];
    actualizadas[editando] = nuevaCafeteria;
    setCafeterias(actualizadas);
    setEditando(null);
    setNuevaCafeteria({ nombre: "", direccion: "", descripcion: "", imagen: "" });
  };

  const handleEliminar = (index) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cafetería?")) return;
    const actualizadas = [...cafeterias];
    actualizadas.splice(index, 1);
    setCafeterias(actualizadas);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Gestión de Cafeterías</h2>

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
