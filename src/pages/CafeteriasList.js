import React, { useEffect, useState } from "react";
import cafeteriasData from "../data/cafeterias.json";
import { Link } from "react-router-dom";

const CafeteriasList = ({ searchQuery }) => {
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    setCafeterias(cafeteriasData);
  }, []);

  const cafeteriasFiltradas = cafeterias.filter((cafeteria) => {
    return cafeteria.nombre.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
