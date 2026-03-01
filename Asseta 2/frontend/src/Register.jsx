import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      alert(response.data);
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.response?.data || "Something went wrong.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#242424', color: 'white' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#555',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Back to Main Page
      </button>

      <h1>Create an account</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label htmlFor="username" style={{ marginBottom: '10px' }}>Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <label htmlFor="password" style={{ marginBottom: '10px' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#fdd835',
            color: '#121212',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
