import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import CafeteriaDetalles from "./pages/CafeteriaDetalles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/cafeteria/:id" element={<CafeteriaDetalles />} />
        <Route
          path="/perfil"
          element={
          <PrivateRoute>
          <Perfil />
          </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
