import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Kuukaudet nimettynä
const monthNames = [
  "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
  "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
];

const Savings = () => {
  // Tilamuuttujat säästöille ja budjeteille
  const [budgets, setBudgets] = useState([]); // Tallentaa budjetit
  const [totalSavings, setTotalSavings] = useState(0); // Lasketut säästöt
  const navigate = useNavigate();


  // Haetaan käyttäjän budjettitiedot palvelimelta
  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/budgets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Budjettien hakeminen epäonnistui.");
      }

      const data = await response.json();
      setBudgets(data);

      // Lasketaan yhteen kaikki säästöt
      const savingsSum = data.reduce((acc, budget) => acc + (budget.total || 0), 0);
      setTotalSavings(savingsSum);
    } catch (error) {
      console.error("Virhe budjettien hakemisessa:", error);
    }
  };

  // Suoritetaan API-pyyntö, kun komponentti ladataan
  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div
      style={{
        width: "80vw",
        maxWidth: "800px",
        minHeight: "80vh",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: "0 auto",
        marginTop: "20px",
      }}
    >
      {/* Otsikko säästöille */}
      <h2 style={{ color: "black", marginBottom: "50px", fontSize: "28px" }}>Kertyneet säästöt</h2>

      {/* Näytetään yhteensä säästetty summa */}
      <h3 style={{ color: totalSavings >= 0 ? "black" : "#FF4500" }}>
        Yhteensä: {totalSavings.toFixed(2)}€
      </h3>

      {/* Pylväsdiagrammi säästöistä */}
      <div style={{ width: "100%", height: 300, marginTop: "120px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={budgets.map(b => ({
              name: `${monthNames[b.month - 1]} ${b.year}`, // Muunnetaan kuukausi numerosta nimeksi
              savings: b.total
            }))}
          >
            <XAxis dataKey="name" /> {/* X-akselilla kuukauden nimi ja vuosi */}
            <YAxis /> {/* Y-akselilla säästöjen määrä */}
            <Tooltip /> {/* Näytetään lisätietoja hoveroinnilla */}
            <Bar dataKey="savings" fill="steelblue" /> {/* SteelBlue-värinen palkki */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lista yksittäisistä kuukausisäästöistä */}
      <ul style={{ listStyleType: "none", padding: 0, textAlign: "left", marginTop: "120px" }}>
        {budgets.map((budget) => (
          <li
            key={budget.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              color: budget.total >= 0 ? "black" : "#FF4500", // Negatiiviset säästöt punaisella
            }}
          >
            {monthNames[budget.month - 1]} {budget.year}: {budget.total.toFixed(2)}€
          </li>
        ))}
      </ul>

      {/* Takaisin-painike palauttaa dashboardiin */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          backgroundColor: "gray",
          color: "white",
          fontWeight: "bold",
          padding: "12px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          width: "150px",
          height: "45px",
          marginTop: "20px",
          marginLeft: "650px",
        }}
      >
        Takaisin
      </button>

    </div>
  );
};

export default Savings;

// import { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { useNavigate } from "react-router-dom";

// // Kuukaudet nimettynä
// const monthNames = [
//   "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
//   "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
// ];

// const Savings = () => {
//   // Tilamuuttujat säästöille ja budjeteille
//   const [budgets, setBudgets] = useState([]); // Tallentaa budjetit
//   const [totalSavings, setTotalSavings] = useState(0); // Lasketut säästöt
//   const navigate = useNavigate();


//   // Haetaan käyttäjän budjettitiedot palvelimelta
//   const fetchBudgets = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/budgets", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Budjettien hakeminen epäonnistui.");
//       }

//       const data = await response.json();
//       setBudgets(data);

//       // Lasketaan yhteen kaikki säästöt
//       const savingsSum = data.reduce((acc, budget) => acc + (budget.total || 0), 0);
//       setTotalSavings(savingsSum);
//     } catch (error) {
//       console.error("Virhe budjettien hakemisessa:", error);
//     }
//   };

//   // Suoritetaan API-pyyntö, kun komponentti ladataan
//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   return (
//     <div
//       style={{
//         width: "80vw",
//         maxWidth: "800px",
//         minHeight: "80vh",
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "10px",
//         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         textAlign: "center",
//         margin: "0 auto",
//         marginTop: "20px",
//       }}
//     >
//       {/* Otsikko säästöille */}
//       <h2 style={{ color: "black", marginBottom: "50px", fontSize: "28px" }}>Kertyneet säästöt</h2>

//       {/* Näytetään yhteensä säästetty summa */}
//       <h3 style={{ color: totalSavings >= 0 ? "black" : "#FF4500" }}>
//         Yhteensä: {totalSavings.toFixed(2)}€
//       </h3>

//       {/* Pylväsdiagrammi säästöistä */}
//       <div style={{ width: "100%", height: 300, marginTop: "120px" }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart 
//             data={budgets.map(b => ({
//               name: `${monthNames[b.month - 1]} ${b.year}`, // Muunnetaan kuukausi numerosta nimeksi
//               savings: b.total
//             }))}
//           >
//             <XAxis dataKey="name" /> {/* X-akselilla kuukauden nimi ja vuosi */}
//             <YAxis /> {/* Y-akselilla säästöjen määrä */}
//             <Tooltip /> {/* Näytetään lisätietoja hoveroinnilla */}
//             <Bar dataKey="savings" fill="steelblue" /> {/* SteelBlue-värinen palkki */}
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Lista yksittäisistä kuukausisäästöistä */}
//       <ul style={{ listStyleType: "none", padding: 0, textAlign: "left", marginTop: "120px" }}>
//         {budgets.map((budget) => (
//           <li
//             key={budget.id}
//             style={{
//               padding: "10px",
//               borderBottom: "1px solid #ccc",
//               color: budget.total >= 0 ? "black" : "#FF4500", // Negatiiviset säästöt punaisella
//             }}
//           >
//             {monthNames[budget.month - 1]} {budget.year}: {budget.total.toFixed(2)}€
//           </li>
//         ))}
//       </ul>

//       {/* Takaisin-painike palauttaa dashboardiin */}
//       <button
//         onClick={() => navigate("/dashboard")}
//         style={{
//           backgroundColor: "gray",
//           color: "white",
//           fontWeight: "bold",
//           padding: "12px 20px",
//           borderRadius: "5px",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "16px",
//           width: "150px",
//           height: "45px",
//           marginTop: "20px",
//           marginLeft: "650px",
//         }}
//       >
//         Takaisin
//       </button>

//     </div>
//   );
// };

// export default Savings;