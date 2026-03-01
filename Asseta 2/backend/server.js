const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Připojení k MySQL databázi
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cisco",
  database: "Asseta",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

// API endpoint pro registraci uživatele
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  const query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error inserting data into the database.");
    }
    res.status(201).send("User registered successfully.");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or passsssword" });
    }

    const user = results[0];

    // Ověříme heslo (pokud používáme bcrypt, mělo by být bcrypt.compare)
    if (user.password_hash === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid username or passssword" });
    }
  });
});

// Server naslouchá
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
