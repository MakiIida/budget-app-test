import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewBudget = () => {
  const [month, setMonth] = useState("01"); // Oletuksena tammikuu
  const [year, setYear] = useState(""); // Käyttäjä syöttää vuoden manuaalisesti
  const [income, setIncome] = useState(""); // Suunnitellut tulot
  const [actualIncome, setActualIncome] = useState(""); // Toteutuneet tulot
  const [categories, setCategories] = useState([]); // Kategoriat
  const [expenses, setExpenses] = useState({ // Budjettikategoriat
    // Kulujen seuranta
    food: "",
    rent: "",
    transport: "",
    other: "",
    phone_internet: "",
    electricity_water: "",
    leisure: "",
    healthcare: "",
    public_transport: "",
    car: "",
    insurance: "",
    savings: ""
  });  

  // Tapahtumien seuranta
  const [transactions, setTransactions] = useState([]); // Lista budjetin tapahtumista
  const [transactionType, setTransactionType] = useState("meno"); // "meno" tai "tulo"
  const [summa, setSumma] = useState(""); // Tapahtuman summa
  const [kuvaus, setKuvaus] = useState(""); // Tapahtuman kuvaus
  const [budgetId, setBudgetId] = useState(null); // Tallennetun budjetin ID

  const navigate = useNavigate();

  // **Hae budjettiin liittyvät tapahtumat** 
  const fetchTransactions = async () => {
    if (!budgetId) return; // Jos budjettia ei ole vielä tallennettu, lopetetaan funktio
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sinun täytyy olla kirjautunut sisään!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${budgetId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setTransactions(data); // Päivitetään käyttöliittymä uusilla tiedoilla
      } else {
        console.error("Virhe haettaessa tapahtumia:", data.error);
      }
    } catch (error) {
      console.error(" Virhe haettaessa tapahtumia:", error);
    }
  };

  // **Tallennetaan budjetti**
  const handleSaveBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sinun täytyy olla kirjautunut sisään!");
      return;
    }

    try {
      // **Lähetetään budjetin tiedot palvelimelle**
      const budgetResponse = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          month,
          year: year ? parseInt(year) : new Date().getFullYear(),
          income: income ? parseFloat(income.replace(',', '.')).toFixed(2) : null,
          actualIncome: actualIncome ? parseFloat(actualIncome.replace(',', '.')).toFixed(2) : null,
          expenses
        })
      });
  
      const budgetData = await budgetResponse.json();
  
      if (!budgetResponse.ok) {
        alert(`Virhe tallennuksessa: ${budgetData.error}`);
        return;
      }
  
      const newBudgetId = budgetData.budget.id; // Haetaan luodun budjetin ID
      setBudgetId(newBudgetId); // Päivitetään tila budjetin ID:llä

      // **Tallenna kaikki tapahtumat tietokantaan**
      if (transactions.length > 0) {
        for (const transaction of transactions) {
          await fetch("http://localhost:5000/api/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              budget_id: newBudgetId,
              tyyppi: transaction.tyyppi,
              summa: transaction.summa,
              kuvaus: transaction.kuvaus
            })
          });
        }
      }
  
      alert("Budjetti ja tapahtumat tallennettu onnistuneesti!");
      navigate("/dashboard");
  
    } catch (error) {
      console.error(" Virhe tallennuksessa:", error);
      alert("Budjetin tallennus epäonnistui!");
    }
  };  

  // Lisätään yksittäinen tapahtuma
  const addTransaction = () => {
    // Tarkistetaan, että summa on annettu
    if (!summa || isNaN(parseFloat(summa))) {
      alert("Syötä summa!");
      return;
    }
  
    // Luodaan uusi tapahtuma ilman budjetti-id:tä (koska budjettia ei välttämättä ole tallennettu vielä)
    const newTransaction = {
      tyyppi: transactionType,
      summa: parseFloat(summa.replace(',', '.')).toFixed(2),
      kuvaus,
    };
  
    // Päivitetään UI lisäämällä tapahtuma listaan (ilman tallennusta tietokantaan)
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  
    // Tyhjennetään syötteet
    setSumma("");
    setKuvaus("");
  };

  // **Syötteen käsittely**
  const handleInputChange = (field, value) => {
    let formattedValue = value.replace(/\./g, ','); // Korvataan piste (.) pilkulla (,)

    // Sallitaan vain numerot ja yksi pilkku (desimaalille max 2 numeroa)
    if (!/^\d*(,\d{0,2})?$/.test(formattedValue)) return;

    // Päivitetään oikea kenttä
    setExpenses(prev => ({
        ...prev,
        [field]: formattedValue
    }));
  };

    // **Hae kategoriat tietokannasta heti, kun sivu latautuu**
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/categories");
          const data = await response.json();
          setCategories(data); // Tallennetaan kategoriat tilaan
        } catch (error) {
          console.error(" Virhe haettaessa kategorioita:", error);
        }
      };

      fetchCategories();
    }, []); // Tämä suoritetaan, kun budgetId muuttuu

    // **Haetaan tapahtumat automaattisesti**
    useEffect(() => {
      if (budgetId) {
      fetchTransactions();
      }
    }, [budgetId]); // UI päivittyy aina, kun tapahtumat muuttuvat
    
    return (
      <div
        className="new-budget-form"
        style={{
          width: "120vw",
          maxWidth: "1300px",
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
          marginTop: "-50px"
        }}
      >
    
    {/* Flex-kontti kolmelle sarakkeelle */}
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "150px" }}>

    {/* SARAKE 1: Luo uusi budjetti */}
    <div style={{ flex: "1", textAlign: "left" }}>
      <h3 style={{ color: "black", marginBottom: "50px" }}>Luo uusi budjetti</h3>
      <div style={{ marginBottom: "15px" }}>
        <label style={{color: "black" }}>Kuukausi: </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px" }}>
          <option value="01">Tammikuu</option>
          <option value="02">Helmikuu</option>
          <option value="03">Maaliskuu</option>
          <option value="04">Huhtikuu</option>
          <option value="05">Toukokuu</option>
          <option value="06">Kesäkuu</option>
          <option value="07">Heinäkuu</option>
          <option value="08">Elokuu</option>
          <option value="09">Syyskuu</option>
          <option value="10">Lokakuu</option>
          <option value="11">Marraskuu</option>
          <option value="12">Joulukuu</option>
        </select>
      </div>
  
      <div style={{ marginBottom: "80px", display: "flex", alignItems: "center", gap: "33px" }}>
        <label style={{color: "black" }}>Vuosi: </label>
        <input
          type="number"
          placeholder="Syötä vuosi"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", width: "100px" }}/>
      </div>

      {/* SARAKE 1: Tulot */}
      <div style={{ flex: "1", textAlign: "left" }}>
        <h3 style={{ color: "black", marginBottom: "50px" }}> Tulot</h3>
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "2px" }}>
          <label style={{color: "black" }}>Suunnitellut tulot: </label>
          <input
            type="text"
            placeholder="Syötä summa"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px" }}/>
        </div>

          <div style={{ marginBottom: "15px" }}>
          <label style={{color: "black" }}>Toteutuneet tulot: </label>
          <input
            type="text"
            placeholder="Syötä summa"
            value={actualIncome}
            onChange={(e) => setActualIncome(e.target.value)}
            style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", marginBottom: "40px" }}/>
          </div>

          {transactions
          .filter((transaction) => transaction.tyyppi === "tulo")
          .map((transaction, index) => (
            <div key={index} style={{ color: "black", marginBottom: "10px" }}>
              {transaction.kuvaus}: {transaction.summa}€
            </div>
          ))}
        </div>
      </div>

      {/* SARAKE 2: Menot */}
      <div style={{ flex: "1", textAlign: "left" }}>
      <h3 style={{ color: "black", marginBottom: "50px" }}>Menot:</h3>

      {/* Ruoka */}
      <div style={{ display: "flex", alignItems: "center", gap: "84px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Ruoka: </label>
        <input type="text" placeholder="0" value={expenses.food} onChange={(e) => handleInputChange("food", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Asuminen */}
      <div style={{ display: "flex", alignItems: "center", gap: "55px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Asuminen: </label>
        <input type="text" placeholder="0" value={expenses.rent} onChange={(e) => handleInputChange("rent", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Puhelin ja netti */}
      <div style={{ display: "flex", alignItems: "center", gap: "19px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Puhelin ja netti: </label>
        <input type="text" placeholder="0" value={expenses.phone_internet} onChange={(e) => handleInputChange("phone_internet", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Sähkö ja vesi */}
      <div style={{ display: "flex", alignItems: "center", gap: "31px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Sähkö ja vesi: </label>
        <input type="text" placeholder="0" value={expenses.electricity_water} onChange={(e) => handleInputChange("electricity_water", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Vapaa-aika ja harrastukset */}
      <div style={{ display: "flex", alignItems: "center", gap: "36px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Vapaa-aika ja <br /> harrastukset: </label>
        <input type="text" placeholder="0" value={expenses.leisure} onChange={(e) => handleInputChange("leisure", e.target.value)}
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Terveydenhoito */}
      <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Terveydenhoito: </label>
        <input type="text" placeholder="0" value={expenses.healthcare} onChange={(e) => handleInputChange("healthcare", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Julkinen liikenne */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Julkinen liikenne: </label>
        <input type="text" placeholder="0" value={expenses.public_transport} onChange={(e) => handleInputChange("public_transport", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Auto */}
      <div style={{ display: "flex", alignItems: "center", gap: "94px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Auto: </label>
        <input type="text" placeholder="0" value={expenses.car} onChange={(e) => handleInputChange("car", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Vakuutukset */}
      <div style={{ display: "flex", alignItems: "center", gap: "36px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Vakuutukset: </label>
        <input type="text" placeholder="0" value={expenses.insurance} onChange={(e) => handleInputChange("insurance", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Säästäminen */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "15px" }}>
        <label style={{color: "black" }}>Säästäminen: </label>
        <input type="text" placeholder="0" value={expenses.savings} onChange={(e) => handleInputChange("savings", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
      </div>

      {/* Muut menot */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "50px" }}>
        <label style={{color: "black" }}>Muut menot: </label>
        <input type="text" placeholder="0" value={expenses.other} onChange={(e) => handleInputChange("other", e.target.value)}
        style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", width: "80px" }}/>
      </div>

      {transactions
        .filter(transaction => transaction.tyyppi === "meno")
        .map((transaction, index) => (
          <div key={index} style={{ color: "black", marginBottom: "10px" }}>
            {transaction.kuvaus}: {transaction.summa}€
          </div>
        ))}
      </div>

    {/* SARAKE 3: Lisää uusi tapahtuma */}
    <div style={{ flex: "1", textAlign: "left" }}>
        <h3 style={{ color: "black", marginBottom: "50px" }}> Lisää uusi tapahtuma</h3>
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "14px" }}>
          <label style={{color: "black" }}>Tyyppi: </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", }}>
            <option value="meno">Meno</option>
            <option value="tulo">Tulo</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{color: "black" }}>Summa: </label>
          <input
            type="text"
            placeholder="Syötä summa"
            value={summa}
            onChange={(e) => setSumma(e.target.value)}
            style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", }}/>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{color: "black" }}>Kuvaus: </label>
          <input
            type="text"
            placeholder="Lisää kuvaus (valinnainen)"
            value={kuvaus}
            onChange={(e) => setKuvaus(e.target.value)}
            style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", }}/>
        </div>

        {/* Lisää tapahtuma-nappi */}
        <button onClick={addTransaction}
        onFocus={(e) => e.target.style.outline = "none"}
        onBlur={(e) => e.target.style.outline = "none"} 
        style={{ backgroundColor: "SteelBlue", fontWeight: "bold", color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none", marginTop: "30px", width: "150px", height: "45px", fontSize: "16px", display: "block" }}>
        Lisää tapahtuma
        </button>

        {/* Tallenna budjetti-nappi */}
        <button onClick={handleSaveBudget}
        onFocus={(e) => e.target.style.outline = "none"}
        onBlur={(e) => e.target.style.outline = "none"} 
        style={{ backgroundColor: "SteelBlue", fontWeight: "bold", color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none", marginTop: "350px", width: "150px", height: "45px", fontSize: "16px", display: "block" }}>
        Tallenna budjetti
        </button>

        {/* Takaisin-nappi */}
        <button onClick={() => navigate(-1)} 
        onFocus={(e) => e.target.style.outline = "none"}
        onBlur={(e) => e.target.style.outline = "none"} 
        style={{ backgroundColor: "Gray", fontWeight: "bold",  color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none", marginTop: "15px", width: "150px", height: "45px", fontSize: "16px", display: "block" }}>
        Takaisin
        </button>
      </div>
    </div>
  </div>
  );
};

export default NewBudget;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const NewBudget = () => {
//   const [month, setMonth] = useState("01");
//   const [year, setYear] = useState(""); // Vuosi syötetään käsin
//   const [income, setIncome] = useState(""); // Suunnitellut tulot
//   const [actualIncome, setActualIncome] = useState(""); // Toteutuneet tulot
//   const [categories, setCategories] = useState([]); // Kategoriat
//   const [expenses, setExpenses] = useState({
//     food: "",
//     rent: "",
//     transport: "",
//     other: "",
//     phone_internet: "", // Puhelin ja netti
//     electricity_water: "", // Sähkö ja vesi
//     leisure: "", // Vapaa-aika ja harrastukset
//     healthcare: "", // Terveydenhoito
//     public_transport: "", // Julkinen liikenne
//     car: "", // Auto
//     insurance: "", // Vakuutukset
//     savings: "" // Säästäminen
//   });  

//   const [transactions, setTransactions] = useState([]); // Tallennetaan tapahtumat
//   const [transactionType, setTransactionType] = useState("meno"); // "meno" tai "tulo"
//   const [summa, setSumma] = useState(""); // Tapahtuman summa
//   const [kuvaus, setKuvaus] = useState(""); // Tapahtuman kuvaus
//   const [budgetId, setBudgetId] = useState(null); // TÄMÄ LISÄTTY TESTINÄ!!!

//   const navigate = useNavigate();

//   // TÄHÄN TEKSTI 
//   const fetchTransactions = async () => {
//     if (!budgetId) return; // Varmistetaan, että budjetti on tallennettu
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Sinun täytyy olla kirjautunut sisään!");
//       return;
//     }
  
//     try {
//       const response = await fetch(`http://localhost:5000/api/transactions/${budgetId}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         setTransactions(data); // Päivitä UI uusilla tiedoilla
//       } else {
//         console.error("Virhe haettaessa tapahtumia:", data.error);
//       }
//     } catch (error) {
//       console.error(" Virhe haettaessa tapahtumia:", error);
//     }
//   };

//   // **Tallennusfunktio**
//   const handleSaveBudget = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Sinun täytyy olla kirjautunut sisään!");
//       return;
//     }

//     try {
//       // **Tallenna budjetti**
//       const budgetResponse = await fetch("http://localhost:5000/api/budgets", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           month,
//           year: year ? parseInt(year) : new Date().getFullYear(),
//           income: income ? parseFloat(income.replace(',', '.')).toFixed(2) : null,
//           actualIncome: actualIncome ? parseFloat(actualIncome.replace(',', '.')).toFixed(2) : null,
//           expenses
//         })
//       });
  
//       const budgetData = await budgetResponse.json();
  
//       if (!budgetResponse.ok) {
//         alert(`Virhe tallennuksessa: ${budgetData.error}`);
//         return;
//       }
  
//       const newBudgetId = budgetData.budget.id;
//       setBudgetId(newBudgetId);

//       // **Tallenna kaikki tapahtumat tietokantaan**
//       if (transactions.length > 0) {
//         for (const transaction of transactions) {
//           await fetch("http://localhost:5000/api/transactions", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               budget_id: newBudgetId,
//               tyyppi: transaction.tyyppi,
//               summa: transaction.summa,
//               kuvaus: transaction.kuvaus
//             })
//           });
//         }
//       }
  
//       alert("Budjetti ja tapahtumat tallennettu onnistuneesti!");
//       navigate("/dashboard");
  
//     } catch (error) {
//       console.error(" Virhe tallennuksessa:", error);
//       alert("Budjetin tallennus epäonnistui!");
//     }
//   };  

//   // Lisätään yksittäinen tapahtuma ONKO LIIAN VÖHÖN SISENNETTY?
//   const addTransaction = () => {
//     // Tarkistetaan, että summa on annettu
//     if (!summa || isNaN(parseFloat(summa))) {
//       alert("Syötä summa!");
//       return;
//     }
  
//     // Luodaan uusi tapahtuma ilman budjetti-id:tä (koska budjettia ei välttämättä ole tallennettu vielä)
//     const newTransaction = {
//       tyyppi: transactionType,
//       summa: parseFloat(summa.replace(',', '.')).toFixed(2),
//       kuvaus,
//     };
  
//     // Päivitetään UI lisäämällä tapahtuma listaan (ilman tallennusta tietokantaan)
//     setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  
//     // Tyhjennetään syötteet
//     setSumma("");
//     setKuvaus("");
//   };

//   // **Syötteen käsittely**
//   const handleInputChange = (field, value) => {
//     let formattedValue = value.replace(/\./g, ','); // Korvataan piste (.) pilkulla (,)

//     // Sallitaan vain numerot ja yksi pilkku (desimaalille max 2 numeroa)
//     if (!/^\d*(,\d{0,2})?$/.test(formattedValue)) return;

//     // Päivitetään oikea kenttä
//     setExpenses(prev => ({
//         ...prev,
//         [field]: formattedValue
//     }));
//   };

//     // Hae kategoriat tietokannasta heti, kun sivu latautuu
//     useEffect(() => {
//       const fetchCategories = async () => {
//         try {
//           const response = await fetch("http://localhost:5000/api/categories");
//           const data = await response.json();
//           setCategories(data); // Tallennetaan kategoriat tilaan
//         } catch (error) {
//           console.error(" Virhe haettaessa kategorioita:", error);
//         }
//       };

//       fetchCategories();
//     }, []); // Tämä suoritetaan, kun budgetId muuttuu

//     // Haetaan tapahtumat automaattisesti
//     useEffect(() => {
//       if (budgetId) {
//       fetchTransactions();
//       }
//     }, [budgetId]); // UI päivittyy aina, kun tapahtumat muuttuvat
    
//     return (
//       <div
//         className="new-budget-form"
//         style={{
//           width: "120vw", // SÄÄDÄ
//           maxWidth: "1300px", // SÄÄDÄ
//           minHeight: "80vh",
//           backgroundColor: "white",
//           padding: "30px", // SÄÄDÄ
//           borderRadius: "10px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           textAlign: "center",
//           margin: "0 auto",
//           marginTop: "-50px"
//         }}
//       >
    
//         {/* Flex-kontti kolmelle sarakkeelle */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//             gap: "150px" // SÄÄDÄ
//           }}
//         >
//           {/* SARAKE 1: Luo uusi budjetti */}
//           <div style={{ flex: "1", textAlign: "left" }}>
//             <h3 style={{ color: "black" }}>Luo uusi budjetti</h3>
//             <div style={{ marginBottom: "15px" }}>
//               <label style={{ fontWeight: "bold", color: "black" }}>Kuukausi: </label>
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 style={{
//                   backgroundColor: "white",
//                   color: "black",
//                   border: "1px solid #ccc",
//                   padding: "5px",
//                   borderRadius: "5px"
//                 }}
//               >
//                 <option value="01">Tammikuu</option>
//                 <option value="02">Helmikuu</option>
//                 <option value="03">Maaliskuu</option>
//                 <option value="04">Huhtikuu</option>
//                 <option value="05">Toukokuu</option>
//                 <option value="06">Kesäkuu</option>
//                 <option value="07">Heinäkuu</option>
//                 <option value="08">Elokuu</option>
//                 <option value="09">Syyskuu</option>
//                 <option value="10">Lokakuu</option>
//                 <option value="11">Marraskuu</option>
//                 <option value="12">Joulukuu</option>
//               </select>
//             </div>
    
//             <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "33px" }}>
//               <label style={{ fontWeight: "bold", color: "black" }}>Vuosi: </label>
//               <input
//                 type="number"
//                 placeholder="Syötä vuosi"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 style={{
//                   backgroundColor: "white",
//                   color: "black",
//                   border: "1px solid #ccc",
//                   padding: "5px",
//                   borderRadius: "5px",
//                   width: "100px"
//                 }}
//               />
//             </div>

//           {/* Menot */}
//           <h3 style={{ color: "black", marginBottom: "15px" }}>Menot:</h3>

//           {/* Ruoka */}
//           <div style={{ display: "flex", alignItems: "center", gap: "84px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Ruoka: </label>
//             <input type="text" placeholder="0" value={expenses.food} onChange={(e) => handleInputChange("food", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Asuminen */}
//           <div style={{ display: "flex", alignItems: "center", gap: "55px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Asuminen: </label>
//             <input type="text" placeholder="0" value={expenses.rent} onChange={(e) => handleInputChange("rent", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Puhelin ja netti */}
//           <div style={{ display: "flex", alignItems: "center", gap: "19px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Puhelin ja netti: </label>
//             <input type="text" placeholder="0" value={expenses.phone_internet} onChange={(e) => handleInputChange("phone_internet", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Sähkö ja vesi */}
//           <div style={{ display: "flex", alignItems: "center", gap: "31px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Sähkö ja vesi: </label>
//             <input type="text" placeholder="0" value={expenses.electricity_water} onChange={(e) => handleInputChange("electricity_water", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Vapaa-aika ja harrastukset */}
//           <div style={{ display: "flex", alignItems: "center", gap: "36px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Vapaa-aika ja <br /> harrastukset: </label>
//             <input type="text" placeholder="0" value={expenses.leisure} onChange={(e) => handleInputChange("leisure", e.target.value)}
//               style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px", borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Terveydenhoito */}
//           <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Terveydenhoito: </label>
//             <input type="text" placeholder="0" value={expenses.healthcare} onChange={(e) => handleInputChange("healthcare", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Julkinen liikenne */}
//           <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Julkinen liikenne: </label>
//             <input type="text" placeholder="0" value={expenses.public_transport} onChange={(e) => handleInputChange("public_transport", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Auto */}
//           <div style={{ display: "flex", alignItems: "center", gap: "94px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Auto: </label>
//             <input type="text" placeholder="0" value={expenses.car} onChange={(e) => handleInputChange("car", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Vakuutukset */}
//           <div style={{ display: "flex", alignItems: "center", gap: "36px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Vakuutukset: </label>
//             <input type="text" placeholder="0" value={expenses.insurance} onChange={(e) => handleInputChange("insurance", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Säästäminen */}
//           <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "15px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Säästäminen: </label>
//             <input type="text" placeholder="0" value={expenses.savings} onChange={(e) => handleInputChange("savings", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {/* Muut menot */}
//           <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "100px" }}>
//             <label style={{ fontWeight: "bold", color: "black" }}>Muut menot: </label>
//             <input type="text" placeholder="0" value={expenses.other} onChange={(e) => handleInputChange("other", e.target.value)}
//             style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", padding: "5px",borderRadius: "5px", width: "80px" }}/>
//           </div>

//           {transactions
//             .filter(transaction => transaction.tyyppi === "meno")
//             .map((transaction, index) => (
//               <div key={index} style={{ color: "red", fontWeight: "bold" }}>
//                 {transaction.kuvaus}: {transaction.summa}€
//               </div>
//             ))}
//           </div>

//       {/* SARAKE 2: Tulot */}
//       <div style={{ flex: "1", textAlign: "left" }}>
//         <h3 style={{ color: "black" }}> Tulot</h3>
//         <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "2px" }}>
//           <label style={{ fontWeight: "bold", color: "black" }}>Suunnitellut tulot: </label>
//           <input
//             type="text"
//             placeholder="Syötä summa"
//             value={income}
//             onChange={(e) => setIncome(e.target.value)}
//             style={{
//               backgroundColor: "white",
//               color: "black",
//               border: "1px solid #ccc",
//               padding: "5px",
//               borderRadius: "5px"
//             }}
//           />
//         </div>

//         {transactions
//           .filter((transaction) => transaction.tyyppi === "tulo")
//           .map((transaction, index) => (
//             <div key={index} style={{ color: "green", fontWeight: "bold" }}>
//               {transaction.kuvaus}: {transaction.summa}€
//             </div>
//           ))}

//           <div style={{ marginBottom: "15px" }}>
//           <label style={{ fontWeight: "bold", color: "black" }}>Toteutuneet tulot: </label>
//           <input
//             type="text"
//             placeholder="Syötä summa"
//             value={actualIncome}
//             onChange={(e) => setActualIncome(e.target.value)}
//             style={{
//               backgroundColor: "white",
//               color: "black",
//               border: "1px solid #ccc",
//               padding: "5px",
//               borderRadius: "5px"
//             }}
//           />
//         </div>
//       </div>

//     {/* SARAKE 3: Lisää yksittäinen tapahtuma */}
//     <div style={{ flex: "1", textAlign: "left" }}>
//         <h3 style={{ color: "black" }}> Lisää uusi tapahtuma</h3>
//         <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "14px" }}>
//           <label style={{  fontWeight: "bold", color: "black" }}>Tyyppi: </label>
//           <select
//             value={transactionType}
//             onChange={(e) => setTransactionType(e.target.value)}
//             style={{
//               backgroundColor: "white",
//               color: "black",
//               border: "1px solid #ccc",
//               padding: "5px",
//               borderRadius: "5px",
//             }}
//           >
//             <option value="meno">Meno</option>
//             <option value="tulo">Tulo</option>
//           </select>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ fontWeight: "bold", color: "black" }}>Summa: </label>
//           <input
//             type="text"
//             placeholder="Syötä summa"
//             value={summa}
//             onChange={(e) => setSumma(e.target.value)}
//             style={{
//               backgroundColor: "white",
//               color: "black",
//               border: "1px solid #ccc",
//               padding: "5px",
//               borderRadius: "5px",
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ fontWeight: "bold", color: "black" }}>Kuvaus: </label>
//           <input
//             type="text"
//             placeholder="Lisää kuvaus (valinnainen)"
//             value={kuvaus}
//             onChange={(e) => setKuvaus(e.target.value)}
//             style={{
//               backgroundColor: "white",
//               color: "black",
//               border: "1px solid #ccc",
//               padding: "5px",
//               borderRadius: "5px",
//             }}
//           />
//         </div>

//         {/* Lisää tapahtuma-nappi */}
//         <button onClick={addTransaction}
//         onFocus={(e) => e.target.style.outline = "none"}
//         onBlur={(e) => e.target.style.outline = "none"} 
//         style={{ backgroundColor: "skyblue", color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none" }}>
//         Lisää tapahtuma
//         </button>
//       </div>
//     </div>

//     {/* Tallenna budjetti-nappi */}
//     <button onClick={handleSaveBudget}
//     onFocus={(e) => e.target.style.outline = "none"}
//     onBlur={(e) => e.target.style.outline = "none"} 
//     style={{ backgroundColor: "skyblue", color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none", marginBottom: "15px" }}>
//     Tallenna budjetti
//     </button>

//     {/* Takaisin-nappi */}
//     <button onClick={() => navigate(-1)} 
//     onFocus={(e) => e.target.style.outline = "none"}
//     onBlur={(e) => e.target.style.outline = "none"} 
//     style={{ backgroundColor: "skyblue", color: "white", padding: "10px", borderRadius: "5px", border: "none", outline: "none", marginBottom: "15px" }}>
//     Takaisin
//     </button>
//     </div>
//   );
// };

// export default NewBudget;
