import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { Link } from "react-router-dom";

const CafeteriasList = ({
  searchQuery = "",
  itemsPerPage = 5,
  currentPage = 1,
  handlePageChange = () => {},
}) => {
  const [cafeterias, setCafeterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await api.get("/cafeterias");
        setCafeterias(response.data);
      } catch (error) {
        setCafeterias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeterias();
  }, []);

  // Filtrar cafeterías por búsqueda (soporta nombre o nombreCafeteria)
  const filteredCafeterias = cafeterias.filter((cafeteria) =>
    (cafeteria.nombre || cafeteria.nombreCafeteria || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Calcular las cafeterías a mostrar para la página actual
  const indexOfLastCafeteria = currentPage * itemsPerPage;
  const indexOfFirstCafeteria = indexOfLastCafeteria - itemsPerPage;
  const currentCafeterias = filteredCafeterias.slice(indexOfFirstCafeteria, indexOfLastCafeteria);

  // Número total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredCafeterias.length / itemsPerPage));

  if (loading) return <p>Cargando cafeterías...</p>;

  return (
    <div>
      <div className="cafeteria-list">
        {currentCafeterias.length > 0 ? (
          currentCafeterias.map((cafeteria, index) => (
            <div key={cafeteria.id || cafeteria.nombreCafeteria || index} className="cafeteria-card">
              <img
                src={cafeteria.imagen || cafeteria.imagenURL || "default_image.jpg"}
                alt={cafeteria.nombre || cafeteria.nombreCafeteria || "Cafetería"}
              />
              <h3>{cafeteria.nombre || cafeteria.nombreCafeteria}</h3>
              <p>{cafeteria.descripcion || cafeteria.ubicacion}</p>
              <Link
                to={`/cafeteria/${cafeteria.id}`}
                className="button"
                style={{ marginTop: "10px" }}
              >
                Ver detalles
              </Link>
            </div>
          ))
        ) : (
          <p>No se encontraron cafeterías con los filtros aplicados.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default CafeteriasList;