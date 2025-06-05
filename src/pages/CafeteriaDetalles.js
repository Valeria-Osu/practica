import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/axios";
import '../styles/styles.css';

const CafeteriaDetalles = () => {
  const { id } = useParams();
  const [cafeteria, setCafeteria] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchCafeteria = async () => {
      try {
        const response = await api.get(`/cafeterias/${id}`);
        setCafeteria(response.data);
      } catch (error) {
        setMensaje("Hubo un error al obtener los detalles de la cafetería.");
      } finally {
        setLoading(false);
      }
    };

    fetchCafeteria();
  }, [id]);

  useEffect(() => {
    const fetchMenusYProductos = async () => {
      try {
        const [menusRes, productosRes] = await Promise.all([
          api.get("/menus"),
          api.get("/productos"),
        ]);
        setMenus(menusRes.data);
        setProductos(productosRes.data);
      } catch (error) {
        // Puedes mostrar un mensaje si lo deseas
      }
    };
    fetchMenusYProductos();
  }, []);

  if (loading) return <p className="loading-message">Cargando...</p>;
  if (!cafeteria) return <p className="error-message">Cafetería no encontrada</p>;

  const nombreMenuEsperado = `${cafeteria.nombreCafeteria} Menú`;
  const menuCafeteria = menus.find(m => m.nombreMenu === nombreMenuEsperado);

  // Filtrar productos del menú por idMenu (relación real)
  let productosMenu = [];
  if (menuCafeteria && menuCafeteria.idMenu) {
    productosMenu = productos.filter(prod => prod.idMenu === menuCafeteria.idMenu);
  }

  return (
    <div className="main-container">
      <div className="card detalles-card">
        <div className="detalles-img-panel">
          {cafeteria.imagenURL && (
            <img
              src={cafeteria.imagenURL}
              alt={cafeteria.nombreCafeteria}
              className="cafeteria-image"
            />
          )}
        </div>

        <div className="detalles-info-panel">
          <h2 className="form-title">
            {cafeteria.nombreCafeteria}
          </h2>
          <div className="detalles-info">
            <p><b>Ubicación:</b> {cafeteria.ubicacion}</p>
            <p><b>Zona:</b> {cafeteria.zona}</p>
            <p><b>Descripción:</b> {cafeteria.descripcion}</p>
            <p><b>Horario:</b> {cafeteria.horarios}</p>
            <p><b>Servicios:</b> {cafeteria.tipoServicio}</p>
            <p><b>Teléfono:</b> {cafeteria.telefono}</p>
            {cafeteria.detalles && <p><b>Detalles adicionales:</b> {cafeteria.detalles}</p>}
          </div>
        </div>
      </div>

      {/* Panel del menú debajo */}
      <div className="card menu-panel">
        <h3 className="menu-title">Menú</h3>
        {menuCafeteria ? (
          <>
            {menuCafeteria.descripcion && <p>{menuCafeteria.descripcion}</p>}
            <div className="productos-menu">
              {productosMenu.length > 0 ? (
                <ul className="productos-lista">
                  {productosMenu.map((prod) => (
                    <li key={prod.id} className="producto-item">
                      <span className="producto-nombre">{prod.nombreProducto}</span>
                      <span className="producto-precio">${prod.precio.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay productos disponibles para este menú.</p>
              )}
            </div>
          </>
        ) : (
          <p>No hay menú registrado para esta cafetería.</p>
        )}
      </div>

      {/* Mensaje de error y botón de regreso */}
      <div className="detalles-footer">
        {mensaje && <p className="error-message">{mensaje}</p>}
        <Link to="/" className="button">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
};

export default CafeteriaDetalles;