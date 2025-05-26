import React from "react";
import { auth } from "../firebase";
import CafeteriasList from "./CafeteriasList";

const Dashboard = () => {
  const user = auth.currentUser;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido, {user?.email || "Usuario"}</h1>
      <p>Explora las cafeterías disponibles en tu ciudad:</p>
      <hr />
      <CafeteriasList />
    </div>
  );
};

export default Dashboard;
