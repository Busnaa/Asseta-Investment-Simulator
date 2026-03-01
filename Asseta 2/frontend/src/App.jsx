import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const scrollToSection = () => {
    document.getElementById("about-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* Navigace */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">Asseta</div>
          <div className="nav-links">
            <a href="#" className="nav-item" onClick={scrollToSection}>About</a>
            <a href="#" className="nav-item">Contact</a>
          </div>
        </div>
        <div className="auth-buttons">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
            Login
          </a>
          <button className="cta-button" onClick={() => navigate("/register")}>
            Open account
          </button>
        </div>
      </nav>

      {/* První sekce (úvod) */}
      <main className="main-content">
        <div className="text-content">
          <h1>Finest Investment Simulator</h1>
          <p>Built for everyone</p>
          <button className="start-button" onClick={() => navigate("/register")}>
            Start now
          </button>
        </div>
        <div className="image-content">
          <img src="/stonks.jpg" alt="App preview" className="app-image" />
        </div>
      </main>

      {/* Druhá sekce (o aplikaci) */}
      <section id="about-section" className="about-section">
        <div className="about-text">
          <h2>About Asseta</h2>
          <p>Asseta is an investment simulator that helps users practice trading in a risk-free environment.</p>
        </div>
        <div className="about-image">
          <img src="/about.jpg" alt="About Asseta" className="about-img" />
        </div>
      </section>
    </div>
  );
}

export default App;
