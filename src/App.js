import { useState } from "react"; // Importar useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./components/PrivateRoute"; // Mantén la protección para las rutas privadas
import Dashboard from "./pages/Dashboard";
import CafeteriaDetalles from "./pages/CafeteriaDetalles";
import MenuGestion from "./pages/MenuGestion";
import CafeteriasAdmin from "./components/CafeteriasAdmin";
import ModeracionAdmin from "./components/ModeracionAdmin";
import Header from "./components/Header"; // Importa el Header
import './styles/styles.css'; // Importando el archivo CSS con los estilos globales

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // Define el estado para la búsqueda

  return (
    <Router>
      {/* El Header se renderiza fuera de las rutas para que esté disponible en todas las páginas */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Rutas del sistema */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard searchQuery={searchQuery} />} /> {/* Pasamos searchQuery al Dashboard */}
        <Route path="/cafeteria/:id" element={<CafeteriaDetalles />} />
        <Route path="/admin/cafeterias" element={<CafeteriasAdmin />} />
        <Route path="/admin/moderacion" element={<ModeracionAdmin />} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/cafeteria/:id/gestion-menu" element={<PrivateRoute roles={["admin"]}><MenuGestion /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
