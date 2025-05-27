import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import CafeteriaDetalles from "./pages/CafeteriaDetalles";
import { AuthProvider } from "./context/AuthContext";
import MenuGestion from "./pages/MenuGestion";
import CafeteriasAdmin from "./components/CafeteriasAdmin";
import ModeracionAdmin from "./components/ModeracionAdmin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/cafeteria/:id" element={<CafeteriaDetalles />} />
          <Route path="/cafeteria/:id/gestion-menu" element={<MenuGestion />} />
          <Route path="/admin/cafeterias" element={<CafeteriasAdmin />} />
          <Route path="/admin/cafeterias" element={<CafeteriasAdmin />} />
          <Route path="/admin/moderacion" element={<ModeracionAdmin />} />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/cafeteria/:id/MenuGestion"
            element={
              <PrivateRoute roles={["admin"]}>
                <MenuGestion />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
