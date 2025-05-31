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

      {/* Contenedor de perfil y botones de autenticación */}
      <div className="auth-buttons">
        <Link to="/login">
          <button>Iniciar sesión</button>
        </Link>
        <Link to="/register">
          <button>Registrarse</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;