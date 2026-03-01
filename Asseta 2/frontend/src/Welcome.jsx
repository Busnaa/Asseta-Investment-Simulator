import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Přidáme stylování

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Vítejte zpátky!</h1>
      <div className="button-container">
        <button className="dashboard-button" onClick={() => navigate("/learning")}>
          Learning
        </button>
        <button className="dashboard-button" onClick={() => navigate("/invest")}>
          Invest
        </button>
      </div>
    </div>
  );
}
