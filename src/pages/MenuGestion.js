import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Asume que las cafeterías y el menú se obtienen de una API backend
import "../styles/styles.css";

const MenuGestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafeteria, setCafeteria] = useState(null); // Almacenará los datos de la cafetería
  const [menu, setMenu] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener el token de autenticación desde localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirigir al login si no hay token
    }

    // Obtener la cafetería y el menú desde la API
    const fetchCafeteria = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cafeterias/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Pasar el token en la cabecera
          }
        });
        const data = await response.json();
        if (response.status === 200) {
          setCafeteria(data.cafeteria);
          setMenu(data.cafeteria.menu);
        } else {
          setMensaje("Error al obtener los datos de la cafetería.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la cafetería:", error);
        setMensaje("Hubo un error al obtener la cafetería.");
        setLoading(false);
      }
    };

    fetchCafeteria();
  }, [id, navigate, token]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!cafeteria) {
    return <p>Cafetería no encontrada</p>;
  }

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    try {
      const response = await fetch(`http://localhost:5000/cafeterias/${id}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      });
      const data = await response.json();

      if (response.status === 200) {
        setMenu([...menu, data.nuevoProducto]);
        setNuevoProducto({ nombre: "", precio: "" });
        setMensaje("Producto agregado correctamente.");
      } else {
        setMensaje(data.message || "Error al agregar el producto.");
      }
    } catch (error) {
      setMensaje("Hubo un error al agregar el producto.");
    }
  };

  const handleEditar = (index) => {
    setNuevoProducto(menu[index]);
    setEditandoIndex(index);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    const actualizado = { ...nuevoProducto, precio: parseFloat(nuevoProducto.precio) };

    try {
      const response = await fetch(`http://localhost:5000/cafeterias/${id}/menu/${menu[editandoIndex].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(actualizado),
      });
      const data = await response.json();

      if (response.status === 200) {
        const actualizadas = [...menu];
        actualizadas[editandoIndex] = data.productoActualizado;
        setMenu(actualizadas);
        setNuevoProducto({ nombre: "", precio: "" });
        setEditandoIndex(null);
        setMensaje("Producto actualizado correctamente.");
      } else {
        setMensaje(data.message || "Error al actualizar el producto.");
      }
    } catch (error) {
      setMensaje("Hubo un error al actualizar el producto.");
    }
  };

  const handleEliminar = async (index) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const response = await fetch(`http://localhost:5000/cafeteria/${id}/menu/${menu[index].id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        const actualizado = [...menu];
        actualizado.splice(index, 1);
        setMenu(actualizado);
        setMensaje("Producto eliminado correctamente.");
      } else {
        setMensaje(data.message || "Error al eliminar el producto.");
      }
    } catch (error) {
      setMensaje("Hubo un error al eliminar el producto.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Gestión de Menú - {cafeteria.nombre}</h2>
      {mensaje && <p>{mensaje}</p>}

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
  cursor: "pointer",
};

const btnEliminar = {
  ...btn,
  backgroundColor: "#e57373",
  color: "white",
};

const btnPrincipal = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#6f4e37",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default MenuGestion;
