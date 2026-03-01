import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx"; // Import registrační stránky
import Welcome from "./Welcome.jsx";
import Invest from "./Invest";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/invest" element={<Invest />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
