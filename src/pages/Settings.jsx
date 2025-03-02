import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Oletko varma, että haluat poistaa tilisi? Tätä toimintoa ei voi peruuttaa!"
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:5000/users/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Tilin poistaminen epäonnistui.");

      alert("Tilisi on poistettu onnistuneesti.");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage")); // Pakotetaan tilan päivitys
      navigate("/login");

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
