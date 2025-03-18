import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles.css";
import React from "react";

const Login = () => {
  // Käyttäjän autentikointitiedot
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState(""); // Tallennetaan käyttäjän sähköposti
  const [password, setPassword] = useState(""); // Tallennetaan käyttäjän salasana
  const [loading, setLoading] = useState(false); // Latausanimaatio kirjautumiselle
  const [showPassword, setShowPassword] = useState(false); // Näytetäänkö salasana vai ei
  const navigate = useNavigate(); // Navigointi eri sivuille

  // Tarkistetaan, onko sähköposti tallennettu localStorageen
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Käsitellään kirjautumispyyntö
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Kirjautuminen epäonnistui.");
      }

      // Tallennetaan token ja käyttäjän sähköposti localStorageen
      localStorage.setItem("token", data.token);
      localStorage.setItem("savedEmail", email);
      setIsAuthenticated(true);
      navigate("/dashboard"); // Ohjataan käyttäjä dashboard-sivulle
    } catch (error) {
      console.error("Kirjautumisvirhe:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      width: "60vw",
      maxWidth: "800px",
      minHeight: "80vh",
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "auto",
      position: "relative"
  }}>
  
      {/* Esittelyteksti kirjautumissivulle */}
      <p style={{
        maxWidth: "600px",
        textAlign: "center",
        fontSize: "18px",
        lineHeight: "1.5",
        color: "black",
        marginTop: "-300px",
        marginBottom: "50px"
      }}>
        Seuraa tulojasi ja menojasi ja pidä taloutesi hallinnassa vaivattomasti. <br />
        Luo, muokkaa ja tarkastele budjettejasi helposti yhdessä paikassa.
      </p>

      {/* Kirjautumisotsikko */}
      <h2 style={{ color: "black", fontSize: "35px", fontWeight: "bold" }}>Kirjaudu sisään</h2>

      <form onSubmit={handleLogin}>
        {/* Sähköpostikenttä */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "120%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black",
              transform: "translateX(-30px)"
            }}
          />
        </div>

        {/* Salasanakenttä silmäpainikkeella */}
        <div style={{ marginBottom: "10px", position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "120%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black",
              transform: "translateX(-30px)"
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              right: "-50px",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            {showPassword ? "👁️" : "🔒"} {/* Näytä/piilota salasana */}
          </button>
        </div>

        {/* Kirjaudu-painike */}
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "SteelBlue",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              marginTop: "10px"
            }}
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </div>

        {/* Rekisteröidy-painike */}
        <div>
          <button
            onClick={() => navigate("/register")}
            style={{
              backgroundColor: "SteelBlue",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              marginTop: "10px"
            }}
          >
            Rekisteröidy
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;