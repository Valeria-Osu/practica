import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios.js";
import Recomendaciones from "./Recomendaciones";
import CafeteriaModal from "./CafeteriaModal";
import "../styles/styles.css";
import coffeeImg from "../assets/coffee.jpg";

const zonas = [
  { value: "", label: "Selecciona zona" },
  { value: "centro", label: "Centro" },
  { value: "norte", label: "Norte" },
  { value: "sur", label: "Sur" }
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
  const [appliedFilters, setAppliedFilters] = useState({ ciudad: "" });
  const [cafeteriaSeleccionada, setCafeteriaSeleccionada] = useState(null);

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
  };

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await api.get("/cafeterias");
        setCafeterias(response.data);
      } catch (error) {
        console.error("Error al cargar las cafeterías:", error);
      }
    };

    fetchCafeterias();
  }, []);

  // Filtrado de cafeterías según los filtros aplicados
  const filteredCafeterias = cafeterias.filter((cafeteria) => {
    return !appliedFilters.ciudad || cafeteria.zona === appliedFilters.ciudad;
  });

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
          <select
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
          >
            {zonas.map(z => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>

          <MultiSelectDropdown
            options={opcionesServicios}
            selected={servicios}
            setSelected={setServicios}
            placeholder="Servicios"
          />

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

        {user && <Recomendaciones preferencias={appliedFilters} />}

        {cafeteriaSeleccionada && (
          <CafeteriaModal
            cafeteria={cafeteriaSeleccionada}
            onClose={() => setCafeteriaSeleccionada(null)}
          />
        )}

        {/* Paneles de cafeterías */}
        <div className="card-container">
          {filteredCafeterias.length === 0 ? (
            <p style={{ width: "100%", textAlign: "center", color: "#a47551", fontWeight: "bold" }}>
              No se encontraron cafeterías.
            </p>
          ) : (
            filteredCafeterias.map((cafeteria, idx) => (
              <div
                key={cafeteria.nombreCafeteria + idx}
                className="card"
                style={{ flex: "1 1 40%", maxWidth: "45%", minWidth: "260px" }}
              >
                <img src={"default_image.jpg"} alt={cafeteria.nombreCafeteria} />
                <h3>{cafeteria.nombreCafeteria}</h3>
                <p>{cafeteria.ubicacion}</p>
                <Link to={`/cafeteria/${idx + 1}`} className="button">
                  Ver detalles
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;