import { Link } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header>
      {/* Logo y título que redirige al Dashboard */}
      <div className="logo" onClick={() => window.location.href = '/'}>
        <img src={require('../logo.svg')} alt="Logo" />
        <h1>Catálogo de Cafeterías</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Contenedor de perfil y botón de inicio de sesión */}
      <div className="profile-container">
        <Link to="/login">
          <button className="login-button">Iniciar sesión</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
