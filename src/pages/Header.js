import { Link } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="dashboard-header">
      <h2 className="dashboard-title">Cafeterías</h2>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar cafeterías por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="profile-container">
        <Link to="/login">
          <button className="login-button">Iniciar sesión</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
