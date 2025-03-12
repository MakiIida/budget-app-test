import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [income, setIncome] = useState("");
  const [plannedExpenses, setPlannedExpenses] = useState(0);
  const [actualExpenses, setActualExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("meno");
  const [summa, setSumma] = useState("");
  const [kuvaus, setKuvaus] = useState("");
  const [addedExpenses, setAddedExpenses] = useState([]);
  const [addedIncomes, setAddedIncomes] = useState([]);

    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Budjetin hakeminen epäonnistui.");
        }
    
        const data = await response.json();
        console.log("API Response:", data);
    
        setBudget(data);
        setIncome(data.actual_income ? Number(data.actual_income) : 0);
        
        const totalActualExpenses =
          (data.expenses ? Number(data.expenses) : 0) +
          (data.transaction_expenses ? Number(data.transaction_expenses) : 0);
    
        setPlannedExpenses(data.planned_expenses || 0);
        setActualExpenses(totalActualExpenses);
      } catch (error) {
        console.error("Virhe budjetin hakemisessa:", error);
      }
    };
    
    // Nyt funktiot ovat käytettävissä `useEffect`-hookissa
    useEffect(() => {
      fetchBudget();
      fetchTransactions();
    }, [id]);
    
  

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Saving budget with ID:", id);

      const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income: Number(income),
          planned_expenses: plannedExpenses,
          actual_expenses: actualExpenses,
        }),
      });

      if (!response.ok) {
        throw new Error("Budjetin tallentaminen epäonnistui.");
      }

      alert("Budjetti päivitetty!");
      navigate("/budget-list");
    } catch (error) {
      console.error("Virhe tallennuksessa:", error);
    }
  };

  const addTransaction = async () => {
    // Tarkistetaan, onko summa numero ja positiivinen
    const parsedSumma = parseFloat(summa);
    if (isNaN(parsedSumma) || parsedSumma <= 0) {
      alert("Virhe: Syötä kelvollinen summa!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget_id: id,
          tyyppi: transactionType,
          summa: parsedSumma, // Käytetään varmistettua numeroarvoa
          kuvaus,
        }),
      });

      if (!response.ok) {
        throw new Error("Tapahtuman lisäys epäonnistui.");
      }

      alert("Tapahtuma lisätty!");
      setTransactions([...transactions, { tyyppi: transactionType, summa: parsedSumma, kuvaus }]);
      setSumma("");
      setKuvaus("");

      fetchTransactions();
    } catch (error) {
      console.error("Virhe lisättäessä tapahtumaa:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Tapahtumien hakeminen epäonnistui.");
      }
  
      const data = await response.json();
      console.log("Tapahtumat:", data);
  
      // Suodatetaan tapahtumat menoihin ja tuloihin
      setAddedExpenses(data.filter(transaction => transaction.tyyppi === "meno"));
      setAddedIncomes(data.filter(transaction => transaction.tyyppi === "tulo"));
    } catch (error) {
      console.error("Virhe haettaessa tapahtumia:", error);
    }
  };
  
  // Käynnistetään haku heti, kun sivu latautuu
  useEffect(() => {
    fetchBudget(); // Hakee budjetin tiedot
    fetchTransactions(); // Hakee tapahtumat
  }, [id]); 
  

  if (!budget) return <p>Ladataan budjettia...</p>;

  // Kuukausien nimet
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        margin: "0 auto",
        marginTop: "20px",
      }}
    >
      <h3 style={{ color: "black", marginBottom: "50px" }}> Muokkaa budjettia - {budget ? monthNames[budget.month] : ""}</h3>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap", paddingLeft: "100px" }}>Tulot:</label>
        <input
          type="number"
          step="0.01"
          value={income !== "" ? income : ""}
          onChange={(e) => setIncome(e.target.value)}
          onBlur={(e) => setIncome(parseFloat(e.target.value).toFixed(2))} // Muotoilee luvun, kun käyttäjä poistuu kentästä
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap" }}>Suunnitellut menot:</label>
        <input
          type="number"
          step="0.01"
          value={plannedExpenses !== "" ? plannedExpenses : ""}
          onChange={(e) => setPlannedExpenses(e.target.value)}
          onBlur={(e) => setPlannedExpenses(parseFloat(e.target.value).toFixed(2))}
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap" }}>Toteutuneet menot:</label>
        <input
          type="number"
          step="0.01"
          value={actualExpenses !== "" ? actualExpenses : ""}
          onChange={(e) => setActualExpenses(e.target.value)}
          onBlur={(e) => setActualExpenses(parseFloat(e.target.value).toFixed(2))}
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      <h3 style={{ marginTop: "30px", color: "black" }}>Lisätyt tulot</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {addedIncomes.length === 0 ? (
          <li style={{ color: "black" }}>Ei lisättyjä tuloja</li>
        ) : (
          addedIncomes.map((income, index) => (
            <li key={index} style={{ color: "black" }}>
              {income.kuvaus}: {parseFloat(income.summa).toFixed(2)}€
            </li>
          ))
        )}
      </ul>

      <h3 style={{ marginTop: "30px", color: "black" }}>Lisätyt menot</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {addedExpenses.length === 0 ? (
          <li style={{ color: "black" }}>Ei lisättyjä menoja</li>
        ) : (
          addedExpenses.map((expense, index) => (
            <li key={index} style={{ color: "black" }}>
              {expense.kuvaus}: {parseFloat(expense.summa).toFixed(2)}€
            </li>
          ))
        )}
      </ul>



      <h3 style={{ marginTop: "30px", color: "black" }}>Lisää uusi tapahtuma</h3>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap" }}>Tyyppi:</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            marginRight: "10px"
          }}
        >
          <option value="meno">Meno</option>
          <option value="tulo">Tulo</option>
        </select>
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap" }}>Summa:</label>
        <input
          type="number"
          placeholder="Syötä summa"
          value={summa}
          onChange={(e) => setSumma(e.target.value)}
          min="0"
          step="0.01"
          pattern="[0-9]+(\.[0-9]{1,2})?"
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <label style={{ color: "black", whiteSpace: "nowrap" }}>Kuvaus:</label>
        <input
          type="text"
          placeholder="Lisää kuvaus (valinnainen)"
          value={kuvaus}
          onChange={(e) => {
            const newValue = e.target.value.replace(/[0-9]/g, ""); // Poistaa numerot
            setKuvaus(newValue);
          }}
          style={{
            width: "20%",
            minWidth: "200px",
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      <button
        onClick={addTransaction}
        style={{
          backgroundColor: "steelblue",
          color: "white",
          fontWeight: "bold",
          padding: "10px",
          borderRadius: "5px",
          width: "20%",
          marginTop: "10px",
        }}
      >
        Lisää tapahtuma
      </button>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: "steelblue",
          color: "white",
          fontWeight: "bold",
          padding: "10px",
          borderRadius: "5px",
          width: "20%",
          marginTop: "100px",
        }}
      >
        Tallenna budjetti
      </button>

      <button
        onClick={() => navigate("/budget-list")}
        style={{
          backgroundColor: "gray",
          color: "white",
          fontWeight: "bold",
          padding: "10px",
          borderRadius: "5px",
          width: "20%",
          marginTop: "15px",
        }}
      >
        Takaisin
      </button>
    </div>
  );
};

export default EditBudget;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const EditBudget = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [budget, setBudget] = useState(null);
//   const [income, setIncome] = useState("");
//   const [plannedExpenses, setPlannedExpenses] = useState(0);
//   const [actualExpenses, setActualExpenses] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [transactionType, setTransactionType] = useState("meno");
//   const [summa, setSumma] = useState("");
//   const [kuvaus, setKuvaus] = useState("");

//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error("Budjetin hakeminen epäonnistui.");
//         }
  
//         const data = await response.json();
//         console.log("API Response:", data); // 🔍 Tarkista, näkyykö `transaction_expenses`
  
//         setBudget(data);
  
//         //** Tulot haetaan `actual_income` **
//         setIncome(data.actual_income ? Number(data.actual_income) : 0);
  
//         // ** Toteutuneet menot = `expenses` + `transaction_expenses` **
//         const totalActualExpenses =
//           (data.expenses ? Number(data.expenses) : 0) +
//           (data.transaction_expenses ? Number(data.transaction_expenses) : 0);
  
//         setPlannedExpenses(data.planned_expenses || 0);
//         setActualExpenses(totalActualExpenses);
//       } catch (error) {
//         console.error("Virhe budjetin hakemisessa:", error);
//       }
//     };
  
//     fetchBudget();
//   }, [id]); // Päivittyy aina, kun `id` muuttuu
  

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Saving budget with ID:", id);

//       const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           income,
//           planned_expenses: plannedExpenses,
//           actual_expenses: actualExpenses,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Budjetin tallentaminen epäonnistui.");
//       }

//       alert("Budjetti päivitetty!");
//       navigate("/budget-list");
//     } catch (error) {
//       console.error("Virhe tallennuksessa:", error);
//     }
//   };

//   const addTransaction = async () => {
//     // Tarkistetaan, onko summa numero ja positiivinen
//     const parsedSumma = parseFloat(summa);
//     if (isNaN(parsedSumma) || parsedSumma <= 0) {
//       alert("Virhe: Syötä kelvollinen summa!");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/transactions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           budget_id: id,
//           tyyppi: transactionType,
//           summa: parsedSumma, // Käytetään varmistettua numeroarvoa
//           kuvaus,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Tapahtuman lisäys epäonnistui.");
//       }

//       alert("Tapahtuma lisätty!");
//       setTransactions([...transactions, { tyyppi: transactionType, summa: parsedSumma, kuvaus }]);
//       setSumma("");
//       setKuvaus("");
//     } catch (error) {
//       console.error("Virhe lisättäessä tapahtumaa:", error);
//     }
//   };

//   if (!budget) return <p>Ladataan budjettia...</p>;

//   // Kuukausien nimet
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
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         margin: "0 auto",
//         marginTop: "20px",
//       }}
//     >
//       <h3 style={{ color: "black", marginBottom: "50px" }}> Muokkaa budjettia - {budget ? monthNames[budget.month] : ""}</h3>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap", paddingLeft: "100px" }}>Tulot:</label>
//         <input
//           type="number"
//           step="0.01"
//           value={income !== "" ? income : ""}
//           onChange={(e) => setIncome(e.target.value)}
//           onBlur={(e) => setIncome(parseFloat(e.target.value).toFixed(2))} // Muotoilee luvun, kun käyttäjä poistuu kentästä
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         />
//       </div>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap" }}>Suunnitellut menot:</label>
//         <input
//           type="number"
//           step="0.01"
//           value={plannedExpenses !== "" ? plannedExpenses : ""}
//           onChange={(e) => setPlannedExpenses(e.target.value)}
//           onBlur={(e) => setPlannedExpenses(parseFloat(e.target.value).toFixed(2))}
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         />
//       </div>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap" }}>Toteutuneet menot:</label>
//         <input
//           type="number"
//           step="0.01"
//           value={actualExpenses !== "" ? actualExpenses : ""}
//           onChange={(e) => setActualExpenses(e.target.value)}
//           onBlur={(e) => setActualExpenses(parseFloat(e.target.value).toFixed(2))}
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         />
//       </div>

//       <h3 style={{ marginTop: "30px", color: "black" }}>Lisätyt tulot</h3>
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {/* Tänne lisätään myöhemmin lista tuloista */}
//       </ul>

//       <h3 style={{ marginTop: "30px", color: "black" }}>Lisätyt menot</h3>
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {/* Tänne lisätään myöhemmin lista menoista */}
//       </ul>



//       <h3 style={{ marginTop: "30px", color: "black" }}>Lisää uusi tapahtuma</h3>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap" }}>Tyyppi:</label>
//         <select
//           value={transactionType}
//           onChange={(e) => setTransactionType(e.target.value)}
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//             marginRight: "10px"
//           }}
//         >
//           <option value="meno">Meno</option>
//           <option value="tulo">Tulo</option>
//         </select>
//       </div>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap" }}>Summa:</label>
//         <input
//           type="number"
//           placeholder="Syötä summa"
//           value={summa}
//           onChange={(e) => setSumma(e.target.value)}
//           min="0"
//           step="0.01"
//           pattern="[0-9]+(\.[0-9]{1,2})?"
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         />
//       </div>

//       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//         <label style={{ color: "black", whiteSpace: "nowrap" }}>Kuvaus:</label>
//         <input
//           type="text"
//           placeholder="Lisää kuvaus (valinnainen)"
//           value={kuvaus}
//           onChange={(e) => {
//             const newValue = e.target.value.replace(/[0-9]/g, ""); // Poistaa numerot
//             setKuvaus(newValue);
//           }}
//           style={{
//             width: "20%",
//             minWidth: "200px",
//             backgroundColor: "white",
//             color: "black",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         />
//       </div>

//       <button
//         onClick={addTransaction}
//         style={{
//           backgroundColor: "steelblue",
//           color: "white",
//           fontWeight: "bold",
//           padding: "10px",
//           borderRadius: "5px",
//           width: "20%",
//           marginTop: "10px",
//         }}
//       >
//         Lisää tapahtuma
//       </button>

//       <button
//         onClick={handleSave}
//         style={{
//           backgroundColor: "steelblue",
//           color: "white",
//           fontWeight: "bold",
//           padding: "10px",
//           borderRadius: "5px",
//           width: "20%",
//           marginTop: "100px",
//         }}
//       >
//         Tallenna budjetti
//       </button>

//       <button
//         onClick={() => navigate("/budget-list")}
//         style={{
//           backgroundColor: "gray",
//           color: "white",
//           fontWeight: "bold",
//           padding: "10px",
//           borderRadius: "5px",
//           width: "20%",
//           marginTop: "15px",
//         }}
//       >
//         Takaisin
//       </button>
//     </div>
//   );
// };

// export default EditBudget;
