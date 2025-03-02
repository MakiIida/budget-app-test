import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewBudget = () => {
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(""); // Vuosi syötetään käsin
  const [income, setIncome] = useState(""); // Suunnitellut tulot
  const [actualIncome, setActualIncome] = useState(""); // Toteutuneet tulot
  const [categories, setCategories] = useState([]); // Kategoriat
  const [expenses, setExpenses] = useState({
    food: "",
    rent: "",
    transport: "",
    other: "",
    phone_internet: "", // Puhelin ja netti
    electricity_water: "", // Sähkö ja vesi
    leisure: "", // Vapaa-aika ja harrastukset
    healthcare: "", // Terveydenhoito
    public_transport: "", // Julkinen liikenne
    car: "", // Auto
    insurance: "", // Vakuutukset
    savings: "" // Säästäminen
  });  

  const [transactions, setTransactions] = useState([]); // Tallennetaan tapahtumat
  const [transactionType, setTransactionType] = useState("meno"); // "meno" tai "tulo"
  const [summa, setSumma] = useState(""); // Tapahtuman summa
  const [kuvaus, setKuvaus] = useState(""); // Tapahtuman kuvaus
  const [budgetId, setBudgetId] = useState(null); // TÄMÄ LISÄTTY TESTINÄ!!!

  const navigate = useNavigate();

  // TÄHÄN TEKSTI 
  const fetchTransactions = async () => {
    if (!budgetId) return; // Varmistetaan, että budjetti on tallennettu
  
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
        setTransactions(data); // Päivitä UI uusilla tiedoilla
      } else {
        console.error("Virhe haettaessa tapahtumia:", data.error);
      }
    } catch (error) {
      console.error("❌ Virhe haettaessa tapahtumia:", error);
    }
  };

  // **Tallennusfunktio**
  const handleSaveBudget = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sinun täytyy olla kirjautunut sisään!");
      return;
    }
  
    try {
      // 1️⃣ **Tallenna budjetti**
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
  
      const newBudgetId = budgetData.budget.id;
      setBudgetId(newBudgetId);

      // 2️⃣ **Tallenna kaikki tapahtumat tietokantaan**
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
      console.error("❌ Virhe tallennuksessa:", error);
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

    // Hae kategoriat tietokannasta heti, kun sivu latautuu
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/categories");
          const data = await response.json();
          setCategories(data); // Tallennetaan kategoriat tilaan
        } catch (error) {
          console.error("❌ Virhe haettaessa kategorioita:", error);
        }
      };

      fetchCategories();
    }, []); // Tämä suoritetaan, kun budgetId muuttuu

    // Haetaan tapahtumat automaattisesti
    useEffect(() => {
      if (budgetId) {
      fetchTransactions();
      }
    }, [budgetId]); // UI päivittyy aina, kun tapahtumat muuttuvat
    
  return (
    <div className="new-budget-form" style={{ textAlign: "center", color: "black" }}>
      <h2 style={{ color: "black" }}>📊 Luo uusi budjetti</h2>

      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Kuukausi: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
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

      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Vuosi: </label>
        <input
          type="number"
          placeholder="Syötä vuosi"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ color: "black" }}
        />
      </div>

      <h3 style={{ color: "black" }}>💰 Tulot:</h3>
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Suunnitellut tulot (€): </label>
        <input
          type="text"
          placeholder="Syötä summa"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          style={{ color: "black" }}
        />
      </div>

      {transactions
        .filter(transaction => transaction.tyyppi === "tulo")
        .map((transaction, index) => (
          <div key={index} style={{ color: "green", fontWeight: "bold" }}>
            {transaction.kuvaus}: {transaction.summa}€
          </div>
        ))}


      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Toteutuneet tulot (€): </label>
        <input
          type="text"
          placeholder="Syötä summa"
          value={actualIncome}
          onChange={(e) => setActualIncome(e.target.value)}
          style={{ color: "black" }}
        />
      </div>

      <h3 style={{ color: "black" }}>📉 Menot:</h3>
      {/* Ruoka */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Ruoka (€): </label>
        <input type="text" placeholder="0" value={expenses.food} onChange={(e) => handleInputChange("food", e.target.value)} style={{ color: "black" }}/>
      </div>

      {/* Asuminen */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Asuminen (€): </label>
        <input type="text" placeholder="0" value={expenses.rent} onChange={(e) => handleInputChange("rent", e.target.value)} style={{ color: "black" }}/>
      </div>

      {/* Puhelin ja netti */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Puhelin ja netti (€): </label>
        <input type="text" placeholder="0" value={expenses.phone_internet} onChange={(e) => handleInputChange("phone_internet", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Sähkö ja vesi */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Sähkö ja vesi (€): </label>
        <input type="text" placeholder="0" value={expenses.electricity_water} onChange={(e) => handleInputChange("electricity_water", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Vapaa-aika ja harrastukset */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Vapaa-aika ja harrastukset (€): </label>
        <input type="text" placeholder="0" value={expenses.leisure} onChange={(e) => handleInputChange("leisure", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Terveydenhoito */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Terveydenhoito (€): </label>
        <input type="text" placeholder="0" value={expenses.healthcare} onChange={(e) => handleInputChange("healthcare", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Julkinen liikenne */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Julkinen liikenne (€): </label>
        <input type="text" placeholder="0" value={expenses.public_transport} onChange={(e) => handleInputChange("public_transport", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Auto */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Auto (€): </label>
        <input type="text" placeholder="0" value={expenses.car} onChange={(e) => handleInputChange("car", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Vakuutukset */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Vakuutukset (€): </label>
        <input type="text" placeholder="0" value={expenses.insurance} onChange={(e) => handleInputChange("insurance", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Säästäminen */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Säästäminen (€): </label>
        <input type="text" placeholder="0" value={expenses.savings} onChange={(e) => handleInputChange("savings", e.target.value)} style={{ color: "black" }} />
      </div>

      {/* Muut menot */}
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Muut menot (€): </label>
        <input type="text" placeholder="0" value={expenses.other} onChange={(e) => handleInputChange("other", e.target.value)} style={{ color: "black" }}/>
      </div>

      {transactions
        .filter(transaction => transaction.tyyppi === "meno")
        .map((transaction, index) => (
          <div key={index} style={{ color: "red", fontWeight: "bold" }}>
            {transaction.kuvaus}: {transaction.summa}€
          </div>
        ))}


    {/* Tämä testinä lisätty!!! */}
      <h3>➕ Lisää yksittäinen tapahtuma</h3>

      <div>
        <label>Tapahtuman tyyppi: </label>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="meno">📉 Meno</option>
          <option value="tulo">💰 Tulo</option>
        </select>
      </div>

      <div>
        <label>Summa (€): </label>
        <input
          type="text"
          placeholder="Syötä summa"
          value={summa}
          onChange={(e) => setSumma(e.target.value)}
        />
      </div>

      <div>
        <label>Kuvaus: </label>
        <input
          type="text"
          placeholder="Lisää kuvaus (valinnainen)"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
        />
      </div>

      <button onClick={addTransaction}>💾 Lisää tapahtuma</button>
      {/* Testi päättyy tähän */}

      <button onClick={handleSaveBudget} style={{ marginTop: "10px", backgroundColor: "blue", color: "white", padding: "10px", borderRadius: "5px" }}>
        💾 Tallenna budjetti
      </button>

      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "10px", backgroundColor: "gray", color: "white", padding: "10px", borderRadius: "5px" }}>
        🔙 Takaisin
      </button>
    </div>
  );
};

export default NewBudget;