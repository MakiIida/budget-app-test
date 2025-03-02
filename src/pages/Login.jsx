import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importoidaan Context

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext); // Käytä Contextin setIsAuthenticated
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      setIsAuthenticated(true); // Päivitetään tila
      navigate("/dashboard");

    } catch (error) {
      console.error("Kirjautumisvirhe:", error);
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  );
};

export default Login;
