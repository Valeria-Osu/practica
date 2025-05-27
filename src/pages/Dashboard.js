import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import CafeteriasList from "./CafeteriasList";

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Filtros
  const [ciudad, setCiudad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [menu, setMenu] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const toggleServicio = (servicio) => {
    setServicios((prev) =>
      prev.includes(servicio)
        ? prev.filter((s) => s !== servicio)
        : [...prev, servicio]
    );
  };

  const handleAplicarFiltros = () => {
    setAppliedFilters({
      ciudad,
      servicios,
      menu
    });
  };

  const opcionesServicios = ["wifi", "pet-friendly", "terraza", "baños", "desayunos", "estacionamiento"];

  return (
    <div>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#6f4e37",
        color: "#fff"
      }}>
        <h2 style={{ margin: 0 }}>Cafeterías</h2>

        {!user ? (
          <Link to="/login">
            <button style={loginButtonStyle}>
              Iniciar sesión
            </button>
          </Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            {user?.rol === "admin" && (
              <Link
                to="/admin/cafeterias"
                style={{
                  marginRight: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#8b5e3c",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Gestión de Cafeterías
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={profileButtonStyle}
              title="Perfil"
            >
              🧑‍💼
            </button>

            {menuOpen && (
              <div style={menuDropdownStyle}>
                <Link to="/perfil" style={menuLinkStyle}>Mi perfil</Link>
                <button onClick={handleLogout} style={menuButtonStyle}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <div style={{ padding: "2rem" }}>
        <h1>Bienvenido, {user?.email || "Usuario"}</h1>
        <p>Explora las cafeterías disponibles en tu ciudad:</p>

        {/* Botón para moderación solo para admins */}
        {user?.rol === "admin" && (
          <button
            onClick={() => navigate("/admin/moderacion")}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Ir a Moderación
          </button>
        )}

        <hr />

        {/* Barra de Filtros Avanzada */}
        <div style={filterBarStyle}>
          <input
            type="text"
            placeholder="Buscar por ciudad o zona"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            style={filterInputStyle}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {opcionesServicios.map((servicio) => (
              <label key={servicio} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <input
                  type="checkbox"
                  value={servicio}
                  checked={servicios.includes(servicio)}
                  onChange={() => toggleServicio(servicio)}
                />
                {servicio}
              </label>
            ))}
          </div>

          <select
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            style={filterInputStyle}
          >
            <option value="">Tipo de menú</option>
            <option value="cafe">Café</option>
            <option value="desayuno">Desayunos</option>
            <option value="postres">Postres</option>
          </select>

          <button onClick={handleAplicarFiltros} style={filterButtonStyle}>
            Aplicar filtros
          </button>
        </div>

        {/* Lista de cafeterías */}
        <CafeteriasList filtros={appliedFilters} />
      </div>
    </div>
  );
};

// Estilos
const loginButtonStyle = {
  backgroundColor: "#fff",
  color: "#6f4e37",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const profileButtonStyle = {
  background: "transparent",
  color: "#fff",
  fontSize: "1.5rem",
  border: "none",
  cursor: "pointer"
};

const menuDropdownStyle = {
  position: "absolute",
  right: 0,
  top: "2.5rem",
  backgroundColor: "#fff",
  color: "#333",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  overflow: "hidden"
};

const menuLinkStyle = {
  display: "block",
  padding: "0.5rem 1rem",
  textDecoration: "none",
  color: "#333"
};

const menuButtonStyle = {
  display: "block",
  width: "100%",
  padding: "0.5rem 1rem",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  color: "#333"
};

const filterBarStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "1.5rem"
};

const filterInputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "200px"
};

const filterButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#6f4e37",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  alignSelf: "start"
};

export default Dashboard;
