import React from "react";

const CafeteriasList = ({
  cafeterias,
  searchQuery,
  itemsPerPage,
  currentPage,
  handlePageChange,
}) => {
  // Filtrar cafeterías por búsqueda
  const filteredCafeterias = cafeterias.filter((cafeteria) =>
    cafeteria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular las cafeterías a mostrar para la página actual
  const indexOfLastCafeteria = currentPage * itemsPerPage;
  const indexOfFirstCafeteria = indexOfLastCafeteria - itemsPerPage;
  const currentCafeterias = filteredCafeterias.slice(indexOfFirstCafeteria, indexOfLastCafeteria);

  // Número total de páginas
  const totalPages = Math.ceil(filteredCafeterias.length / itemsPerPage);

  return (
    <div>
      <div className="cafeteria-list">
        {currentCafeterias.length > 0 ? (
          currentCafeterias.map((cafeteria, index) => (
            <div key={index} className="cafeteria-card">
              <img src={cafeteria.imagen} alt={cafeteria.nombre} />
              <h3>{cafeteria.nombre}</h3>
              <p>{cafeteria.descripcion}</p>
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
