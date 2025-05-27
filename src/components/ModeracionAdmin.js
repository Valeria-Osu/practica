import React, { useState, useEffect } from "react";

// Datos de ejemplo: reseñas y productos reportados (puedes reemplazar con datos reales / API)
const reseñasReportadasEjemplo = [
  { id: 1, usuario: "juan123", reseña: "Muy mala calidad", inapropiado: true },
  { id: 2, usuario: "ana456", reseña: "El lugar estaba sucio", inapropiado: true }
];

const productosReportadosEjemplo = [
  { id: 1, nombre: "Café aguado", precio: 1.5, inapropiado: true },
  { id: 2, nombre: "Té sin sabor", precio: 2.0, inapropiado: true }
];

const ModeracionAdmin = () => {
  // Estados para reseñas y productos reportados
  const [reseñasReportadas, setReseñasReportadas] = useState([]);
  const [productosReportados, setProductosReportados] = useState([]);

  useEffect(() => {
    // Simular carga de datos (puedes traerlos de tu API o base de datos)
    setReseñasReportadas(reseñasReportadasEjemplo);
    setProductosReportados(productosReportadosEjemplo);
  }, []);

  // Función para eliminar reseña o producto (filtra el elemento eliminado)
  const eliminarContenido = (tipo, id) => {
    if (tipo === "reseña") {
      setReseñasReportadas(reseñasReportadas.filter(r => r.id !== id));
    } else if (tipo === "producto") {
      setProductosReportados(productosReportados.filter(p => p.id !== id));
    }
  };

  // Función para aprobar el contenido (simplemente lo elimina de la lista de reportados)
  const aprobarContenido = (tipo, id) => {
    eliminarContenido(tipo, id);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Moderación y Administración de Contenido</h2>

      <section>
        <h3>Reseñas reportadas</h3>
        {reseñasReportadas.length === 0 ? (
          <p>No hay reseñas reportadas.</p>
        ) : (
          reseñasReportadas.map(({ id, usuario, reseña }) => (
            <div key={id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <p><strong>Usuario:</strong> {usuario}</p>
              <p><strong>Reseña:</strong> {reseña}</p>
              <button onClick={() => aprobarContenido("reseña", id)} style={{ marginRight: "1rem" }}>Aprobar</button>
              <button onClick={() => eliminarContenido("reseña", id)} style={{ backgroundColor: "#e57373", color: "white" }}>Eliminar</button>
            </div>
          ))
        )}
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h3>Productos reportados</h3>
        {productosReportados.length === 0 ? (
          <p>No hay productos reportados.</p>
        ) : (
          productosReportados.map(({ id, nombre, precio }) => (
            <div key={id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <p><strong>Producto:</strong> {nombre}</p>
              <p><strong>Precio:</strong> ${precio.toFixed(2)}</p>
              <button onClick={() => aprobarContenido("producto", id)} style={{ marginRight: "1rem" }}>Aprobar</button>
              <button onClick={() => eliminarContenido("producto", id)} style={{ backgroundColor: "#e57373", color: "white" }}>Eliminar</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ModeracionAdmin;
