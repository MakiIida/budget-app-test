import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Oletko varma, että haluat poistaa tilisi? Tätä toimintoa ei voi peruuttaa!"
    );
    
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/users/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tilin poistaminen epäonnistui.");
      }

      alert("Tilisi on poistettu onnistuneesti.");
      localStorage.removeItem("token"); // Poistetaan token, koska käyttäjä ei ole enää olemassa
      navigate("/login"); // Ohjataan takaisin kirjautumiseen

    } catch (error) {
      console.error("Virhe tilin poistamisessa:", error);
      alert("Virhe tilin poistamisessa: " + error.message);
    }
  };

  return (
    <div className="settings">
      <h2>Asetukset</h2>
      <p>Voit poistaa tilisi pysyvästi täältä.</p>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: "red", color: "white" }}>
        Poista tilini
      </button>
      <button onClick={() => navigate("/dashboard")} style={{ marginLeft: "10px" }}>
        Takaisin
      </button>
    </div>
  );
};

export default Settings;
