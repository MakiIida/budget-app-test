import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings"; 
import "./App.css";
import "./styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tarkistetaan kirjautumisen tila
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Asetetaan true jos token löytyy
  }, []);

  return (
    <Router>
      <div className="container">
        <h1>Budjettisovellus</h1>

        {/* Näytetään napit vain, jos käyttäjä ei ole kirjautunut sisään */}
        {!isAuthenticated && (
          <nav>
            <Link to="/login">
              <button>Kirjaudu sisään</button>
            </Link>
            <Link to="/register">
              <button>Rekisteröidy</button>
            </Link>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<h2>Tervetuloa Budjettisovellukseen!</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

