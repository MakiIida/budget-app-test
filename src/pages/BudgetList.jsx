// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const BudgetList = () => {
//   const location = useLocation();
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Kuukausien nimet muotoon 01 -> Tammikuu
//   const monthNames = {
//     "01": "Tammikuu",
//     "02": "Helmikuu",
//     "03": "Maaliskuu",
//     "04": "Huhtikuu",
//     "05": "Toukokuu",
//     "06": "Kesäkuu",
//     "07": "Heinäkuu",
//     "08": "Elokuu",
//     "09": "Syyskuu",
//     "10": "Lokakuu",
//     "11": "Marraskuu",
//     "12": "Joulukuu"
//   };

//     const fetchBudgets = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:5000/api/budgets", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         });

//         if (!response.ok) throw new Error("Budjettien hakeminen epäonnistui.");
//         const data = await response.json();
//         console.log("DEBUG: API response for budgets:", data);

//         // Järjestetään budjetit kuukauden perusteella
//         // const formattedBudgets = data.map(budget => ({
//         //   ...budget,
//         //   income: Number(budget.actual_income || budget.income || 0),
//         // }));

//         setBudgets(data);
//       } catch (error) {
//         console.error("Virhe budjettien hakemisessa:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false); // 🔥 Lisää tämä, jotta UI päivittyy!
//       }
//     };

//     useEffect(() => {
//       fetchBudgets(); // 🔥 Ladataan uusimmat budjetit aina, kun käyttäjä saapuu tälle sivulle
//     }, [location.state?.refresh]);  // 🔥 Nyt päivittää tiedot aina navigoidessa

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Haluatko varmasti poistaa tämän budjetin?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) {
//         throw new Error("Budjetin poistaminen epäonnistui.");
//       }

//       setBudgets(budgets.filter((budget) => budget.id !== id));
//       alert("Budjetti poistettu!");
//     } catch (error) {
//       console.error("Virhe budjetin poistamisessa:", error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="dashboard-container" style={{
//       width: "60vw",
//       maxWidth: "800px",
//       minHeight: "80vh",
//       backgroundColor: "white",
//       padding: "30px",
//       borderRadius: "10px",
//       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "flex-start",
//       alignItems: "center",
//       margin: "auto",
//       position: "relative",
//       paddingTop: "30px"
//     }}>
//       <h2 style={{ color: "black" }}>Tallennetut budjetit</h2>

//       {loading ? (
//         <p style={{ color: "black" }}>⏳ Ladataan budjetteja...</p>
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : budgets.length === 0 ? (
//         <p style={{ color: "black" }}>Ei tallennettuja budjetteja.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
//           {budgets.map((budget) => {
//             // Korjataan tulot ja menot oikealla datalla
//             const totalIncome = Number(budget.actual_income || 0); // Haetaan toteutuneet tulot
//             const totalExpenses = Number(budget.actual_expenses || 0); // Haetaan toteutuneet menot
//             const totalBalance = totalIncome - totalExpenses; // Lasketaan budjetin saldo

//             return (
//               <li key={budget.id} style={{
//                 marginBottom: "10px",
//                 border: "1px solid #ccc",
//                 padding: "15px",
//                 borderRadius: "10px",
//                 textAlign: "center"
//               }}>
//                 <strong style={{ color: "black" }}>
//                   {monthNames[budget.month]} / {budget.year}
//                 </strong><br />
//                 <span style={{ color: "black" }}>Tulot: <strong>{totalIncome.toFixed(2)}€</strong></span><br />
//                 <span style={{ color: "black" }}>Menot: <strong>{totalExpenses.toFixed(2)}€</strong></span><br />
//                 <span style={{ color: "black" }}>Säästöt: <strong>{totalBalance.toFixed(2)}€</strong></span><br />

//                 <button
//                   onClick={() => navigate(`/edit-budget/${budget.id}`)}
//                   style={{
//                     backgroundColor: "SteelBlue",
//                     color: "white",
//                     padding: "10px",
//                     borderRadius: "5px",
//                     marginRight: "10px",
//                     border: "none",
//                     outline: "none",
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     marginTop: "15px", 
//                     cursor: "pointer",
//                     width: "150px", 
//                     height: "45px", 
//                   }}
//                 >
//                   Muokkaa
//                 </button>

//                 <button
//                   onClick={() => handleDelete(budget.id)}
//                   style={{
//                     backgroundColor: "Gray",
//                     color: "white",
//                     padding: "10px",
//                     borderRadius: "5px",
//                     border: "none",
//                     outline: "none",
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     marginTop: "15px", 
//                     cursor: "pointer",
//                     width: "150px", 
//                     height: "45px", 
//                   }}
//                 >
//                   Poista
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       <button onClick={() => navigate("/dashboard")}
//         style={{
//           backgroundColor: "Gray",
//           fontWeight: "bold",
//           color: "white",
//           padding: "10px",
//           borderRadius: "5px",
//           border: "none",
//           outline: "none",
//           marginTop: "20px",
//           width: "150px",
//           height: "45px",
//           fontSize: "16px",
//           display: "block",
//           position: "absolute",
//           bottom: "5px",
//           right: "30px"
//         }}>
//         Takaisin
//       </button>

//     </div>
//   );
// };

// export default BudgetList;







import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kuukausien nimet muotoon 01 -> Tammikuu
  const monthNames = {
    "01": "Tammikuu",
    "02": "Helmikuu",
    "03": "Maaliskuu",
    "04": "Huhtikuu",
    "05": "Toukokuu",
    "06": "Kesäkuu",
    "07": "Heinäkuu",
    "08": "Elokuu",
    "09": "Syyskuu",
    "10": "Lokakuu",
    "11": "Marraskuu",
    "12": "Joulukuu"
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Ei kirjautumista – kirjaudu sisään nähdäksesi budjetit.");
        }

        const response = await fetch("http://localhost:5000/api/budgets", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Budjettien hakeminen epäonnistui.");
        }

        const data = await response.json();

        // 🔍 TULOSTA DEBUG-TIETO
        console.log("DEBUG: API response for budgets:", data);

        // Järjestetään budjetit kuukauden perusteella
        const sortedBudgets = data.sort((a, b) => {
          return parseInt(a.month) - parseInt(b.month);
        });

        setBudgets(sortedBudgets);
      } catch (error) {
        console.error("Virhe budjettien hakemisessa:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Haluatko varmasti poistaa tämän budjetin?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Budjetin poistaminen epäonnistui.");
      }

      setBudgets(budgets.filter((budget) => budget.id !== id));
      alert("Budjetti poistettu!");
    } catch (error) {
      console.error("Virhe budjetin poistamisessa:", error);
      setError(error.message);
    }
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
      <h2 style={{ color: "black" }}>Tallennetut budjetit</h2>

      {loading ? (
        <p style={{ color: "black" }}>⏳ Ladataan budjetteja...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : budgets.length === 0 ? (
        <p style={{ color: "black" }}>Ei tallennettuja budjetteja.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {budgets.map((budget) => {
            // Korjataan tulot ja menot oikealla datalla
            const totalIncome = Number(budget.actual_income || 0); // Haetaan toteutuneet tulot
            const totalExpenses = Number(budget.actual_expenses || 0); // Haetaan toteutuneet menot
            const totalBalance = totalIncome - totalExpenses; // Lasketaan budjetin saldo

            return (
              <li key={budget.id} style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <strong style={{ color: "black" }}>
                  {monthNames[budget.month]} / {budget.year}
                </strong><br />
                <span style={{ color: "black" }}>Tulot: <strong>{totalIncome.toFixed(2)}€</strong></span><br />
                <span style={{ color: "black" }}>Menot: <strong>{totalExpenses.toFixed(2)}€</strong></span><br />
                <span style={{ color: "black" }}>Säästöt: <strong>{totalBalance.toFixed(2)}€</strong></span><br />

                <button
                  onClick={() => navigate(`/edit-budget/${budget.id}`)}
                  style={{
                    backgroundColor: "SteelBlue",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    marginRight: "10px",
                    border: "none",
                    outline: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "15px", 
                    cursor: "pointer",
                    width: "150px", 
                    height: "45px", 
                  }}
                >
                  Muokkaa
                </button>

                <button
                  onClick={() => handleDelete(budget.id)}
                  style={{
                    backgroundColor: "Gray",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    outline: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "15px", 
                    cursor: "pointer",
                    width: "150px", 
                    height: "45px", 
                  }}
                >
                  Poista
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button onClick={() => navigate("/dashboard")}
        style={{
          backgroundColor: "Gray",
          fontWeight: "bold",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          outline: "none",
          marginTop: "20px",
          width: "150px",
          height: "45px",
          fontSize: "16px",
          display: "block",
          position: "absolute",
          bottom: "5px",
          right: "30px"
        }}>
        Takaisin
      </button>

    </div>
  );
};

export default BudgetList;


