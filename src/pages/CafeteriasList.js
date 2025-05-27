import React, { useEffect, useState } from "react";
import cafeteriasData from "../data/cafeterias.json";
import "./CafeteriasList.css";
import { Link } from "react-router-dom";

const CafeteriasList = ({ filtros }) => {
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    setCafeterias(cafeteriasData);
  }, []);

  const filtrarCafeterias = () => {
    return cafeterias.filter((cafeteria) => {
      // Filtrar por ciudad (usando "direccion")
      if (
        filtros?.ciudad &&
        !cafeteria.direccion.toLowerCase().includes(filtros.ciudad.toLowerCase())
      ) {
        return false;
      }

      // Filtro por múltiples servicios
      if (
        filtros?.servicios?.length > 0 &&
        !filtros.servicios.every((filtro) =>
          cafeteria.servicios.map(s => s.toLowerCase()).includes(filtro.toLowerCase())
        )
      ) {
        return false;
      }

      // Filtrar por menú (si llegas a incluir el campo en el JSON)
      if (
        filtros?.menu &&
        !(cafeteria.menu || []).some((item) =>
          item.toLowerCase().includes(filtros.menu.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  };

  const cafeteriasFiltradas = filtros ? filtrarCafeterias() : cafeterias;

  return (
    <div className="contenedor">
      <h1>Catálogo de Cafeterías</h1>
      {cafeteriasFiltradas.length === 0 ? (
        <p>No se encontraron cafeterías con los filtros aplicados.</p>
      ) : (
        <div className="grid">
          {cafeteriasFiltradas.map((cafeteria) => (
            <div key={cafeteria.id} className="tarjeta">
              {cafeteria.imagen && (
                <img src={cafeteria.imagen} alt={cafeteria.nombre} />
              )}
              <h3>{cafeteria.nombre}</h3>
              <p>{cafeteria.descripcion || "Sin descripción disponible"}</p>
              <p><strong>Dirección:</strong> {cafeteria.direccion || "No especificada"}</p>
              <p><strong>Servicios:</strong> {cafeteria.servicios.filter(Boolean).join(", ") || "No disponibles"}</p>
              <Link to={`/cafeteria/${cafeteria.id}`}>
                <button>Ver detalles</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CafeteriasList;
