import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles.css";

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Kirjautuminen epäonnistui.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("savedEmail", email);
      setIsAuthenticated(true);
      navigate("/dashboard");
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

      <h2 style={{ color: "black", fontSize: "35px", fontWeight: "bold" }}>Kirjaudu sisään</h2>

      <form onSubmit={handleLogin}>
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
            {showPassword ? "👁️" : "🔒"}
          </button>
        </div>

        {/* Kirjaudu-nappi */}
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "skyblue",
              color: "white",
              padding: "12px",
              fontSize: "16px",
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

        {/* Rekisteröidy-nappi */}
        <div>
          <button
            onClick={() => navigate("/register")}
            style={{
              backgroundColor: "skyblue",
              color: "white",
              padding: "12px",
              fontSize: "16px",
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


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext"; // Importoidaan Context

// const Login = () => {
//   const { setIsAuthenticated } = useContext(AuthContext); // Käytä Contextin setIsAuthenticated
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Kirjautuminen epäonnistui.");
//       }

//       localStorage.setItem("token", data.token);
//       setIsAuthenticated(true); // Päivitetään tila
//       navigate("/dashboard");

//     } catch (error) {
//       console.error("Kirjautumisvirhe:", error);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="login">
//       <h2>Kirjaudu sisään</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Sähköposti"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Salasana"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Kirjaudu</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
