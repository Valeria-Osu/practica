import React, { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import cafeteriasData from "../data/cafeterias.json";
import { AuthContext } from "../context/AuthContext";

const MenuGestion = () => {
  const { id } = useParams();
  const cafeteria = cafeteriasData.find(c => c.id === parseInt(id));
  const { user } = useContext(AuthContext);

  const [menu, setMenu] = useState(cafeteria ? cafeteria.menu : []);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [editandoIndex, setEditandoIndex] = useState(null);

  if (!cafeteria) return <p>Cafetería no encontrada</p>;

  // ✅ Restricción solo para admins
  if (!user || user.rol !== "admin") {
    return <p style={{ padding: "2rem" }}>Acceso denegado. Solo administradores pueden gestionar el menú.</p>;
  }

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    setMenu([...menu, { ...nuevoProducto, precio: parseFloat(nuevoProducto.precio) }]);
    setNuevoProducto({ nombre: "", precio: "" });
  };

  const handleEditar = (index) => {
    setNuevoProducto(menu[index]);
    setEditandoIndex(index);
  };

  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    const actualizado = [...menu];
    actualizado[editandoIndex] = { ...nuevoProducto, precio: parseFloat(nuevoProducto.precio) };
    setMenu(actualizado);
    setNuevoProducto({ nombre: "", precio: "" });
    setEditandoIndex(null);
  };

  const handleEliminar = (index) => {
    const actualizado = [...menu];
    actualizado.splice(index, 1);
    setMenu(actualizado);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Gestión de Menú - {cafeteria.nombre}</h2>

      <ul>
        {menu.map((item, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            {item.nombre} - ${item.precio.toFixed(2)}
            <button onClick={() => handleEditar(index)} style={btn}>Editar</button>
            <button onClick={() => handleEliminar(index)} style={btnEliminar}>Eliminar</button>
          </li>
        ))}
      </ul>

      <form onSubmit={editandoIndex !== null ? handleGuardarEdicion : handleAgregar} style={{ marginTop: "2rem" }}>
        <h4>{editandoIndex !== null ? "Editar producto" : "Agregar nuevo producto"}</h4>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={handleInputChange}
            required
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <br />
        <label style={{ marginTop: "1rem", display: "block" }}>
          Precio:
          <input
            type="number"
            name="precio"
            value={nuevoProducto.precio}
            onChange={handleInputChange}
            required
            step="0.01"
            min="0"
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <br />
        <button type="submit" style={btnPrincipal}>
          {editandoIndex !== null ? "Guardar cambios" : "Agregar producto"}
        </button>
      </form>

      <p style={{ marginTop: "2rem" }}>
        <Link to={`/cafeteria/${cafeteria.id}`}>← Volver a detalles</Link>
      </p>
    </div>
  );
};

const btn = {
  marginLeft: "0.5rem",
  padding: "0.2rem 0.5rem",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const btnEliminar = {
  ...btn,
  backgroundColor: "#e57373",
  color: "white"
};

const btnPrincipal = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#6f4e37",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default MenuGestion;
