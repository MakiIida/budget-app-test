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
    <div className="dashboard-container" style={{
      width: "60vw",
      maxWidth: "800px",
      minHeight: "80vh",
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      margin: "auto",
      position: "relative",
      paddingTop: "30px"
    }}>
      {loading ? (
        <p style={{ fontSize: "1.2rem", color: "#555" }}> Ladataan tietoja...</p>
      ) : user && user.name ? (
        <>
          <h3 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "10px", fontSize: "30px" }}> Tervetuloa, {user.name}!</h3>
          <p style={{ color: "#555", textAlign: "center", maxWidth: "600px", marginBottom: "50px", fontSize: "18px" }}>
            Tällä sivulla voit luoda kuukausikohtaisia budjettisuunnitelmia, tarkastella jo tallentamiasi budjetteja,
            muokata niitä ja seurata säästöjäsi helposti.
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", width: "100%" }}>
            <Link to="/new-budget" style={{ ...buttonStyle, display: "block" }}>Luo uusi budjetti</Link>
            <Link to="/budget-list" style={{ ...buttonStyle, display: "block" }}>Tallennetut budjetit</Link>
            <Link to="/" style={{ ...buttonStyle, display: "block" }}>Kertyneet säästöt</Link>
            <Link to="/settings" style={{ ...buttonStyle, display: "block" }}>Asetukset</Link>
            <Link to="/login" onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: "gray", display: "block" }}>Kirjaudu ulos</Link>
          </nav>
        </>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}> Käyttäjätietojen haku epäonnistui.</p>
      )}
    </div>
  );
};

const buttonStyle = {
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "bold",
  color: "white",
  backgroundColor: "SteelBlue",
  padding: "12px 20px",
  borderRadius: "5px",
  textAlign: "center",
  width: "170px",
  height: "25px",
  transition: "background-color 0.3s ease",
  border: "none",
  cursor: "pointer",
  display: "block"
};

export default Dashboard;


