import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  // Tallennetaan käyttäjän syöttämät tiedot
  const { setIsAuthenticated } = useContext(AuthContext);
  const [name, setName] = useState(""); // Käyttäjän nimi
  const [email, setEmail] = useState(""); // Käyttäjän sähköposti
  const [password, setPassword] = useState(""); // Käyttäjän salasana
  const [showPassword, setShowPassword] = useState(false); // Näytetäänkö salasana
  const navigate = useNavigate(); // Navigointi muihin sivuihin

  // Käsitellään rekisteröintilomakkeen lähetys
  const handleRegister = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rekisteröinti epäonnistui.");
      }

      // Tallennetaan token localStorageen onnistuneen rekisteröinnin jälkeen
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
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
      textAlign: "center",
      margin: "auto",
      position: "relative" 
    }}>

      {/* Esittelyteksti */}
      <p style={{
        maxWidth: "800px",
        fontSize: "18px",
        lineHeight: "1.5",
        color: "black",
        marginTop: "-300px",
        marginBottom: "50px"
      }}>
        Luo oma käyttäjätunnus rekisteröitymällä. <br />
        Rekisteröitynä käyttäjänä voit luoda, tallentaa ja muokata tallennettuja budjetteja helposti.
      </p>

      {/* Otsikko */}
      <h2 style={{ color: "black", fontSize: "30px", fontWeight: "bold", marginBottom: "15px" }}>Luo käyttäjätunnus</h2>

      <form onSubmit={handleRegister} style={{ width: "100%" }}>
        {/* Nimikenttä */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Nimi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "40%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black"
            }}
          />
        </div>

        {/* Sähköposti */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "40%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black"
            }}
          />
        </div>

        {/* Salasana */}
        <div style={{ marginBottom: "15px", position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "40%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black"
            }}
          />
          {/* Näytä/piilota salasana */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "215px",
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

        {/* Painikkeet allekkain */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "10px", 
          width: "100%", 
          alignItems: "center" 
        }}>
          {/* Luo käyttäjätunnus-painike */}
          <button 
            type="submit" 
            style={{
              backgroundColor: "SteelBlue",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold", 
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "30%"
            }}
          >
            Luo käyttäjätunnus
          </button>

          {/* Takaisin-painike */}
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "gray",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold", 
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "30%"
            }}
          >
            Takaisin
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "../styles.css";

// const Register = () => {
//   // Tallennetaan käyttäjän syöttämät tiedot
//   const { setIsAuthenticated } = useContext(AuthContext);
//   const [name, setName] = useState(""); // Käyttäjän nimi
//   const [email, setEmail] = useState(""); // Käyttäjän sähköposti
//   const [password, setPassword] = useState(""); // Käyttäjän salasana
//   const [showPassword, setShowPassword] = useState(false); // Näytetäänkö salasana
//   const navigate = useNavigate(); // Navigointi muihin sivuihin

//   // Käsitellään rekisteröintilomakkeen lähetys
//   const handleRegister = async (e) => {
//     e.preventDefault();


//     try {
//       const response = await fetch("http://localhost:5000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Rekisteröinti epäonnistui.");
//       }

//       // Tallennetaan token localStorageen onnistuneen rekisteröinnin jälkeen
//       localStorage.setItem("token", data.token);
//       setIsAuthenticated(true);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div style={{
//       width: "60vw",
//       maxWidth: "800px",
//       minHeight: "80vh",
//       backgroundColor: "white",
//       padding: "30px",
//       borderRadius: "10px",
//       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       textAlign: "center",
//       margin: "auto",
//       position: "relative" 
//     }}>

//       {/* Esittelyteksti */}
//       <p style={{
//         maxWidth: "800px",
//         fontSize: "18px",
//         lineHeight: "1.5",
//         color: "black",
//         marginTop: "-300px",
//         marginBottom: "50px"
//       }}>
//         Luo oma käyttäjätunnus rekisteröitymällä. <br />
//         Rekisteröitynä käyttäjänä voit luoda, tallentaa ja muokata tallennettuja budjetteja helposti.
//       </p>

//       {/* Otsikko */}
//       <h2 style={{ color: "black", fontSize: "30px", fontWeight: "bold", marginBottom: "15px" }}>Luo käyttäjätunnus</h2>

//       <form onSubmit={handleRegister} style={{ width: "100%" }}>
//         {/* Nimikenttä */}
//         <div style={{ marginBottom: "10px" }}>
//           <input
//             type="text"
//             placeholder="Nimi"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             style={{
//               width: "40%",
//               padding: "10px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//               backgroundColor: "white",
//               color: "black"
//             }}
//           />
//         </div>

//         {/* Sähköposti */}
//         <div style={{ marginBottom: "10px" }}>
//           <input
//             type="email"
//             placeholder="Sähköposti"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{
//               width: "40%",
//               padding: "10px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//               backgroundColor: "white",
//               color: "black"
//             }}
//           />
//         </div>

//         {/* Salasana */}
//         <div style={{ marginBottom: "15px", position: "relative" }}>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Salasana"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{
//               width: "40%",
//               padding: "10px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//               backgroundColor: "white",
//               color: "black"
//             }}
//           />
//           {/* Näytä/piilota salasana */}
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             style={{
//               position: "absolute",
//               right: "215px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "18px"
//             }}
//           >
//             {showPassword ? "👁️" : "🔒"}
//           </button>
//         </div>

//         {/* Painikkeet allekkain */}
//         <div style={{ 
//           display: "flex", 
//           flexDirection: "column", 
//           gap: "10px", 
//           width: "100%", 
//           alignItems: "center" 
//         }}>
//           {/* Luo käyttäjätunnus-painike */}
//           <button 
//             type="submit" 
//             style={{
//               backgroundColor: "SteelBlue",
//               color: "white",
//               padding: "12px",
//               fontSize: "16px",
//               fontWeight: "bold", 
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               width: "30%"
//             }}
//           >
//             Luo käyttäjätunnus
//           </button>

//           {/* Takaisin-painike */}
//           <button 
//             type="button" 
//             onClick={() => navigate(-1)}
//             style={{
//               backgroundColor: "gray",
//               color: "white",
//               padding: "12px",
//               fontSize: "16px",
//               fontWeight: "bold", 
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               width: "30%"
//             }}
//           >
//             Takaisin
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register;