import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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

        if (!response.ok) {
          throw new Error("Käyttäjätietojen haku epäonnistui: ");
        }

        const data = await response.json();

        if (!data || !data.name) {
          throw new Error("Virheelliset käyttäjätiedot.");
        }

        setUser(data);
      } catch (error) {
        console.error("Virhe haettaessa käyttäjätietoja:", error);
        localStorage.removeItem("token"); // Poistetaan token, jos jotain meni pieleen
        navigate("/login"); // Ohjataan takaisin kirjautumiseen
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h2>Budjettisovellus</h2>
  
      {loading ? (
        <p style={{ color: "black" }}>⏳ Ladataan tietoja...</p>
      ) : user && user.name ? (
        <>
          <h3 style={{ color: "black", fontWeight: "bold" }}>✅ Tervetuloa, {user.name}!</h3>
        </>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>⚠️ Käyttäjätietojen haku epäonnistui.</p>
      )}
  
      <button onClick={handleLogout}>Kirjaudu ulos</button>
      <button onClick={() => navigate("/settings")} style={{ marginLeft: "10px" }}>
        Asetukset
      </button>
    </div>
  );
};

export default Dashboard;
