import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Importoidaan Context

const Dashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Käyttäjätietojen haku epäonnistui");

        const data = await response.json();
        if (!data || !data.name) throw new Error("Virheelliset käyttäjätiedot.");
        
        setUser(data);
      } catch (error) {
        console.error("Virhe haettaessa käyttäjätietoja:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); 
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h2>Budjettisovellus</h2>

      {loading ? (
        <p>⏳ Ladataan tietoja...</p>
      ) : user && user.name ? (
        <>
          <h3 style={{ color: "black", fontWeight: "bold" }}>✅ Tervetuloa, {user.name}!</h3>
          <nav>
            <Link to="/">🏠 Etusivu</Link>
            <Link to="/budget-list">📑 Tallennetut budjetit</Link>
            <Link to="/new-budget">➕ Luo uusi budjetti</Link>
            <Link to="/settings">⚙️ Asetukset</Link>
          </nav>
          <button onClick={handleLogout}>Kirjaudu ulos</button>
        </>
      ) : (
        <p>⚠️ Käyttäjätietojen haku epäonnistui.</p>
      )}
    </div>
  );
};

export default Dashboard;
