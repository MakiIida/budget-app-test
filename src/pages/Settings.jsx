import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Tarkistetaan, onko käyttäjä kirjautunut sisään
  if (!token) {
    navigate("/login");
    return null;
  }

  // Tilamuuttujat käyttäjätietojen muokkaamiseen
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  //Haetaan kirjautuneen käyttäjän nimi
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsername(data.name); // Tallennetaan käyttäjän nimi tilamuuttujaan
        } else {
          console.error("Virhe haettaessa käyttäjätietoja:", data.error);
        }
      } catch (error) {
        console.error("Verkkovirhe haettaessa käyttäjätietoja:", error);
      }
    };

    fetchUserData();
  }, []);

  // Päivitetään käyttäjänimi tai salasana
  const handleUpdateUser = async () => {
    if (!newUsername && !newPassword) {
      setMessage("Anna uusi käyttäjänimi tai salasana.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Päivitys epäonnistui.");

      setMessage("Päivitys onnistui!");
      setUsername(newUsername || username); // Päivitetään käyttäjänimen näyttö
      setNewUsername("");
      setNewPassword("");

    } catch (error) {
      setMessage(error.message);
    }
  };

  // Käyttäjän tilin poistaminen
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Oletko varma, että haluat poistaa tilisi? Tätä toimintoa ei voi peruuttaa!");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Tilin poistaminen epäonnistui.");

      alert("Tilisi on poistettu onnistuneesti.");
      localStorage.removeItem("token"); // Poistetaan token
      window.dispatchEvent(new Event("storage"));
      navigate("/login");

    } catch (error) {
      console.error("Virhe tilin poistamisessa:", error);
      alert("Virhe tilin poistamisessa: " + error.message);
    }
  };

  return (
    <div
      style={{
        width: "60vw",
        maxWidth: "800px",
        minHeight: "80vh",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: "0 auto",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ color: "black", fontSize: "28px", marginBottom: "20px" }}>Asetukset</h2>

      {/* Näytetään nykyinen käyttäjänimi */}
      <h3 style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        Käyttäjänimi: {username}
      </h3>

      <p style={{ color: "black", fontSize: "18px", marginBottom: "80px" }}>
        Tällä sivulla voit päivittää tilisi käyttäjänimen ja salasanan sekä halutessasi <br /> poistamaan tilin pysyvästi.
        Tämä toiminto on peruuttamaton!
      </p>

      {/* Käyttäjänimen ja salasanan päivitys */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        <label style={{ width: "150px", textAlign: "right", marginRight: "10px", color: "black" }}>
            Uusi käyttäjänimi:
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Syötä uusi käyttäjänimi"
            style={{
              backgroundColor: "white",
              color: "black",
              width: "100%",
              maxWidth: "300px",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
          <label style={{ width: "150px", textAlign: "right", marginRight: "10px", color: "black" }}>
            Uusi salasana:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Syötä uusi salasana"
            style={{
              backgroundColor: "white",
              color: "black",
              width: "100%",
              maxWidth: "270px",
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              paddingRight: "40px",
            }}
          />
            {/* Näkyy/Lukossa-kuvake */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "690px",
                top: "58%",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>

        {/* Päivityspainike */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button
          onClick={handleUpdateUser}
          style={{
            backgroundColor: "steelblue",
            color: "white",
            fontWeight: "bold",
            padding: "12px 20px",
            borderRadius: "5px",
            width: "100%",
            marginTop: "20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            width: "150px",
            height: "45px",
          }}
        >
          Päivitä tiedot
        </button>
      </div>

      {/* Tilin poistaminen */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "auto" }}>
        <button
          onClick={handleDeleteAccount}
          style={{
            backgroundColor: "steelblue",
            color: "white",
            fontWeight: "bold",
            padding: "12px 20px",
            borderRadius: "5px",
            width: "48%",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            width: "150px",
            height: "45px",
          }}
        >
          Poista tili
        </button>

        {/* Takaisin-painike */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "gray",
            color: "white",
            fontWeight: "bold",
            padding: "12px 20px",
            borderRadius: "5px",
            width: "48%",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            width: "150px",
            height: "45px",
          }}
        >
          Takaisin
        </button>
      </div>
    </div>
  );
};

export default Settings;