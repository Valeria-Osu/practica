import React, { useState, useEffect, useRef } from "react";
import Recomendaciones from "./Recomendaciones";
import CafeteriaModal from "./CafeteriaModal";
import "../styles/styles.css";
import coffeeImg from "../assets/coffee.jpg";

const zonas = [
  { value: "", label: "Selecciona zona o ciudad" },
  { value: "centro", label: "Centro" },
  { value: "norte", label: "Norte" },
  { value: "sur", label: "Sur" },
  { value: "poniente", label: "Poniente" },
  { value: "oriente", label: "Oriente" }
];

const opcionesServicios = [
  { value: "wifi", label: "WiFi" },
  { value: "pet-friendly", label: "Pet-friendly" },
  { value: "terraza", label: "Terraza" },
  { value: "baños", label: "Baños" },
  { value: "desayunos", label: "Desayunos" },
  { value: "estacionamiento", label: "Estacionamiento" }
];

const opcionesMenu = [
  { value: "cafe", label: "Café" },
  { value: "desayuno", label: "Desayunos" },
  { value: "postres", label: "Postres" }
];

// Componente MultiSelectDropdown para servicios y menú
function MultiSelectDropdown({ options, selected, setSelected, placeholder = "Seleccionar" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="multi-dropdown" ref={ref}>
      <button
        type="button"
        className="filter-bar-dropdown"
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0
          ? placeholder
          : options
              .filter((opt) => selected.includes(opt.value))
              .map((opt) => opt.label)
              .join(", ")}
        <span style={{ marginLeft: 8 }}>▼</span>
      </button>
      {open && (
        <div className="multi-dropdown-menu">
          {options.map((opt) => (
            <label key={opt.value} className="multi-dropdown-option">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cafeterias, setCafeterias] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [menuSeleccionado, setMenuSeleccionado] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [cafeteriaSeleccionada, setCafeteriaSeleccionada] = useState(null);
  const itemsPerPage = 2; // 2 cafeterías por página

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  }, []);

  const handleAplicarFiltros = () => {
    setAppliedFilters({
      ciudad,
      servicios,
      menu: menuSeleccionado
    });
    setCurrentPage(1); // Reinicia a la primera página al aplicar filtros
  };

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await fetch('http://localhost:5000/cafeterias');
        const data = await response.json();
        setCafeterias(data.cafeterias || data || []);
      } catch (error) {
        console.error("Error al cargar las cafeterías:", error);
      }
    };

    fetchCafeterias();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredCafeterias.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Filtrado de cafeterías según los filtros aplicados
  const filteredCafeterias = cafeterias.filter((cafeteria) => {
    const matchCiudad = !appliedFilters.ciudad || cafeteria.zona === appliedFilters.ciudad;
    const matchMenu =
      !appliedFilters.menu ||
      appliedFilters.menu.length === 0 ||
      (cafeteria.menu &&
        appliedFilters.menu.some((menu) => cafeteria.menu.includes(menu)));
    const matchServicios =
      !appliedFilters.servicios ||
      appliedFilters.servicios.length === 0 ||
      (cafeteria.servicios &&
        appliedFilters.servicios.every((serv) => cafeteria.servicios.includes(serv)));
    return matchCiudad && matchMenu && matchServicios;
  });

  // Pagination logic for visible cafeterias
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const visibleCafeterias = filteredCafeterias.slice(startIdx, endIdx);

  return (
    <div className="menu-principal">
      <div className="div-2">
        {/* Panel de imagen */}
        <div className="panel-image">
          <h2>Explora las cafeterías que hay en Hermosillo</h2>
          <img src={coffeeImg} alt="Cafeterías" />
        </div>

        {/* Barra de filtros */}
        <div className="filter-bar">
          {/* Zona/Ciudad como select */}
          <select
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
          >
            {zonas.map(z => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>

          {/* Servicios como dropdown personalizado */}
          <MultiSelectDropdown
            options={opcionesServicios}
            selected={servicios}
            setSelected={setServicios}
            placeholder="Servicios"
          />

          {/* Menú como dropdown multiselección */}
          <MultiSelectDropdown
            options={opcionesMenu}
            selected={menuSeleccionado}
            setSelected={setMenuSeleccionado}
            placeholder="Tipo de menú"
          />

          <button className="filter-button" onClick={handleAplicarFiltros}>
            Aplicar filtros
          </button>
        </div>

        {/* Recomendaciones si hay usuario */}
        {user && <Recomendaciones preferencias={appliedFilters} />}

        {/* Modal de detalles de cafetería */}
        {cafeteriaSeleccionada && (
          <CafeteriaModal
            cafeteria={cafeteriaSeleccionada}
            onClose={() => setCafeteriaSeleccionada(null)}
          />
        )}

        {/* Paneles de cafeterías */}
        <div className="card-container">
          {visibleCafeterias.length === 0 ? (
            <p style={{ width: "100%", textAlign: "center", color: "#a47551", fontWeight: "bold" }}>
              No se encontraron cafeterías.
            </p>
          ) : (
            visibleCafeterias.map((cafeteria) => (
              <div
                key={cafeteria.id}
                className="card"
                style={{ flex: "1 1 40%", maxWidth: "45%", minWidth: "260px" }}
              >
                <img src={cafeteria.imagen || "default_image.jpg"} alt={cafeteria.nombre} />
                <h3>{cafeteria.nombre}</h3>
                <p>{cafeteria.descripcion}</p>
                <button onClick={() => setCafeteriaSeleccionada(cafeteria)}>
                  Ver detalles
                </button>
              </div>
            ))
          )}
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
            disabled={currentPage === Math.ceil(filteredCafeterias.length / itemsPerPage) || filteredCafeterias.length === 0}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;