import React, { useState, useEffect } from "react";
import CafeteriasList from "./CafeteriasList";
import Recomendaciones from "./Recomendaciones";
import "../styles/styles.css";

const Dashboard = ({ searchQuery }) => {
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
  const [cafeterias, setCafeterias] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [menu, setMenu] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 4; // Número de cafeterías por página

  // Opciones de servicios para los filtros
  const opcionesServicios = ["wifi", "pet-friendly", "terraza", "baños", "desayunos", "estacionamiento"];

  // Verificar si el usuario está autenticado (usando localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT (si estás usando JWT)
      setUser(decodedUser);
    } else {
      setUser(null); // Si no hay token, no hay usuario autenticado
    }
  }, []);

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

  // Lógica para obtener las cafeterías (simulación)
  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await fetch('http://localhost:5000/cafeterias');
        const data = await response.json();
        setCafeterias(data.cafeterias); // Asume que el endpoint devuelve un array de cafeterías
        console.log("Cafeterías cargadas:", data.cafeterias); // Verificar en consola
      } catch (error) {
        console.error("Error al cargar las cafeterías:", error); // Manejo de error
      }
    };

    fetchCafeterias();
  }, []);

  // Cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(cafeterias.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
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
          cafeterias={cafeterias}
          searchQuery={searchQuery}
          itemsPerPage={itemsPerPage} // Número de cafeterías por página
          currentPage={currentPage} // Página actual
          handlePageChange={handlePageChange} // Función para cambiar la página
        />
      </div>
    </div>
  );
};

export default Dashboard;
