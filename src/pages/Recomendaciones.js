import React, { useEffect, useState } from "react";
import CafeteriasList from "./CafeteriasList"; // Asumimos que ya tienes un componente para listar cafeterías

const Recomendaciones = ({ preferencias }) => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  
  // Simulamos la lógica de recomendación (esto debe ser reemplazado por datos reales)
  useEffect(() => {
    const obtenerRecomendaciones = () => {
      // Lógica de filtrado por preferencias, esto puede ser una consulta a la API
      const cafeterias = [
        { id: 1, nombre: "Café Central", tipoMenu: "cafe", ciudad: "Madrid", servicios: ["wifi", "terraza"] },
        { id: 2, nombre: "Café del Mar", tipoMenu: "desayuno", ciudad: "Barcelona", servicios: ["wifi", "pet-friendly"] },
        { id: 3, nombre: "Café Aromas", tipoMenu: "postres", ciudad: "Madrid", servicios: ["baños", "wifi"] },
        // Añadir más cafeterías según los filtros
      ];

      // Filtrar cafeterías basadas en preferencias
      const filtradas = cafeterias.filter(cafeteria => {
        const cumpleCiudad = preferencias.ciudad ? cafeteria.ciudad === preferencias.ciudad : true;
        const cumpleMenu = preferencias.menu ? cafeteria.tipoMenu === preferencias.menu : true;
        const cumpleServicios = preferencias.servicios.every(servicio => cafeteria.servicios.includes(servicio));
        return cumpleCiudad && cumpleMenu && cumpleServicios;
      });

      setRecomendaciones(filtradas);
    };

    obtenerRecomendaciones();
  }, [preferencias]);

  return (
    <div>
      <h2>Recomendaciones Personalizadas</h2>
      <CafeteriasList cafeterias={recomendaciones} />
    </div>
  );
};

export default Recomendaciones;
