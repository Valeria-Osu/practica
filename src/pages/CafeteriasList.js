import React, { useEffect, useState } from "react";
import cafeteriasData from "../data/cafeterias.json";
import "./CafeteriasList.css";
import { Link } from "react-router-dom";

const CafeteriasList = () => {
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    setCafeterias(cafeteriasData);
  }, []);

  return (
    <div className="contenedor">
      <h1>Catálogo de Cafeterías</h1>
      <div className="grid">
        {cafeterias.map((cafeteria) => (
          <div key={cafeteria.id} className="tarjeta">
            <img src={cafeteria.imagen} alt={cafeteria.nombre} />
            <h3>{cafeteria.nombre}</h3>
            <p>{cafeteria.descripcion}</p>
            <Link to={`/cafeteria/${cafeteria.id}`}>
              <button>Ver detalles</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CafeteriasList;
