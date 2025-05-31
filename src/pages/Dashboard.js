import React, { useState, useEffect } from "react";
import CafeteriasList from "./CafeteriasList";
import Recomendaciones from "./Recomendaciones";
import "../styles/styles.css"; // Asegúrate de que el CSS esté importado

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cafeterias, setCafeterias] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [menu, setMenu] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const opcionesServicios = [
    "wifi",
    "pet-friendly",
    "terraza",
    "baños",
    "desayunos",
    "estacionamiento"
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  }, []);

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

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await fetch('http://localhost:5000/cafeterias');
        const data = await response.json();
        setCafeterias(data.cafeterias);
      } catch (error) {
        console.error("Error al cargar las cafeterías:", error);
      }
    };

    fetchCafeterias();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(cafeterias.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Pagination logic for visible cafeterias
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const visibleCafeterias = cafeterias.slice(startIdx, endIdx);

  return (
    <div className="menu-principal">
      <div className="div-2">
        {/* Panel de imagen */}
        <div className="panel-image">
          <h2>Explora las cafeterías que hay en Hermosillo</h2>
          <img src="path_to_image" alt="Cafeterías" />
        </div>

        {/* Barra de filtros */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Buscar por ciudad o zona"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <div className="filter-checkboxes">
            {opcionesServicios.map((servicio) => (
              <label key={servicio} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value={servicio}
                  checked={servicios.includes(servicio)}
                  onChange={() => toggleServicio(servicio)}
                  style={{ marginRight: "6px" }}
                />
                {servicio}
              </label>
            ))}
          </div>
          <select
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
          >
            <option value="">Tipo de menú</option>
            <option value="cafe">Café</option>
            <option value="desayuno">Desayunos</option>
            <option value="postres">Postres</option>
          </select>
          <button className="filter-button" onClick={handleAplicarFiltros}>Aplicar filtros</button>
        </div>

        {/* Recomendaciones si hay usuario */}
        {user && <Recomendaciones preferencias={appliedFilters} />}

        {/* Paneles de cafeterías */}
        <div className="card-container">
          {visibleCafeterias.map((cafeteria) => (
            <div key={cafeteria.id} className="card">
              <img src={cafeteria.imagen || "default_image.jpg"} alt={cafeteria.nombre} />
              <h3>{cafeteria.nombre}</h3>
              <p>{cafeteria.descripcion}</p>
              <button>Ver detalles</button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(cafeterias.length / itemsPerPage)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;