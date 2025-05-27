import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import CafeteriasList from "./CafeteriasList";
import Recomendaciones from "./Recomendaciones"; // Importamos el componente de recomendaciones
import "./Dashboard.css"; // Asegúrate de importar el archivo CSS

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Filtros
  const [ciudad, setCiudad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [menu, setMenu] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda

  // Función para manejar logout
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  // Función para manejar cambios en los servicios seleccionados
  const toggleServicio = (servicio) => {
    setServicios((prev) =>
      prev.includes(servicio)
        ? prev.filter((s) => s !== servicio)
        : [...prev, servicio]
    );
  };

  // Función para aplicar filtros
  const handleAplicarFiltros = () => {
    setAppliedFilters({
      ciudad,
      servicios,
      menu
    });
  };

  // Opciones de servicios para los filtros
  const opcionesServicios = ["wifi", "pet-friendly", "terraza", "baños", "desayunos", "estacionamiento"];

  // Fetch user data from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Establece el usuario
      }
      setLoading(false); // Cambia el estado de carga a false
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);

  // Si el usuario está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Función para manejar el cambio en la búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Función que verifica si el usuario es administrador
  const isAdmin = user?.rol === "admin";

  return (
    <div>
      {/* Header con barra de búsqueda */}
      <header className="dashboard-header">
        <h2 className="dashboard-title">Cafeterías</h2>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cafeterías por nombre..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {!user ? (
          <Link to="/login">
            <button className="login-button">
              Iniciar sesión
            </button>
          </Link>
        ) : (
          <div className="profile-container">
            {isAdmin && (
              <Link
                to="/admin/cafeterias"
                className="admin-button"
              >
                Gestión de Cafeterías
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="profile-button"
              title="Perfil"
            >
              🧑‍💼
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                <Link to="/perfil" className="menu-link">Mi perfil</Link>
                <button onClick={handleLogout} className="menu-button">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <div className="dashboard-content">
        <h1>Bienvenido, {user?.email || "Usuario"}</h1>
        <p>Explora las cafeterías disponibles en tu ciudad:</p>

        {/* Barra de Filtros Avanzada */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Buscar por ciudad o zona"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="filter-input"
          />

          <div className="filter-checkboxes">
            {opcionesServicios.map((servicio) => (
              <label key={servicio} className="filter-checkbox-label">
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
            className="filter-input"
          >
            <option value="">Tipo de menú</option>
            <option value="cafe">Café</option>
            <option value="desayuno">Desayunos</option>
            <option value="postres">Postres</option>
          </select>

          <button onClick={handleAplicarFiltros} className="filter-button">
            Aplicar filtros
          </button>
        </div>

        {/* Mostrar Recomendaciones solo si el usuario está autenticado */}
        {user && <Recomendaciones preferencias={appliedFilters} />}

        <hr />

        {/* Lista de cafeterías filtrada por la búsqueda */}
        <CafeteriasList
          filtros={appliedFilters}
          searchQuery={searchQuery} // Pasa la query de búsqueda al componente de lista
        />
      </div>
    </div>
  );
};

export default Dashboard;
