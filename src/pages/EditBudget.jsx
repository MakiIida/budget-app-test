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

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Budjetin hakeminen epäonnistui.");
        }

        const data = await response.json();
        setBudget(data);
        setIncome(data.income || 0);
        setPlannedExpenses(data.planned_expenses || 0);
        setActualExpenses(data.actual_expenses || 0);
      } catch (error) {
        console.error("❌ Virhe budjetin hakemisessa:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Tapahtumien hakeminen epäonnistui.");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("❌ Virhe haettaessa tapahtumia:", error);
      }
    };

    fetchBudget();
    fetchTransactions();
  }, [id]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          income,
          planned_expenses: plannedExpenses,
          actual_expenses: actualExpenses
        })
      });

      if (!response.ok) {
        throw new Error("Budjetin tallentaminen epäonnistui.");
      }

      alert("Budjetti päivitetty!");
      navigate("/budget-list");
    } catch (error) {
      console.error("❌ Virhe tallennuksessa:", error);
    }
  };

  const addTransaction = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          budget_id: id,
          tyyppi: transactionType,
          summa: parseFloat(summa),
          kuvaus
        })
      });

      if (!response.ok) {
        throw new Error("Tapahtuman lisäys epäonnistui.");
      }

      alert("Tapahtuma lisätty!");
      setTransactions([...transactions, { tyyppi: transactionType, summa, kuvaus }]);
      setSumma("");
      setKuvaus("");
    } catch (error) {
      console.error("❌ Virhe lisättäessä tapahtumaa:", error);
    }
  };

  if (!budget) return <p>⏳ Ladataan budjettia...</p>;

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <h2 style={{ color: "black" }}>📋 Muokkaa budjettia</h2>

      <div style={{ backgroundColor: "#ddd", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
        ✏️ <strong>Muokkaa budjettia</strong>
      </div>

      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Tulot (€): </label>
        <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} 
          style={{ color: "black", backgroundColor: "white", padding: "5px", borderRadius: "5px" }}
        />
      </div>

      <h3>📉 Menot:</h3>
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Suunnitellut menot (€): </label>
        <input type="number" value={plannedExpenses} onChange={(e) => setPlannedExpenses(e.target.value)}
          style={{ color: "black", backgroundColor: "white", padding: "5px", borderRadius: "5px" }}
        />
      </div>
      <div>
        <label style={{ fontWeight: "bold", color: "black" }}>Toteutuneet menot (€): </label>
        <input type="number" value={actualExpenses} onChange={(e) => setActualExpenses(e.target.value)}
          style={{ color: "black", backgroundColor: "white", padding: "5px", borderRadius: "5px" }}
        />
      </div>

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
        <input type="number" value={summa} onChange={(e) => setSumma(e.target.value)} />
      </div>
      <div>
        <label>Kuvaus: </label>
        <input type="text" value={kuvaus} onChange={(e) => setKuvaus(e.target.value)} />
      </div>
      <button onClick={addTransaction} style={{ marginTop: "10px", backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px" }}>
        ➕ Lisää tapahtuma
      </button>

      <h3>📜 Tallennetut tapahtumat</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {transactions.length > 0 ? (
          transactions.map((t, index) => (
            <li key={index} style={{ backgroundColor: "#f4f4f4", margin: "5px", padding: "10px", borderRadius: "5px" }}>
              {t.tyyppi === "tulo" ? "💰" : "📉"} {t.kuvaus || "Ei kuvausta"} - {t.summa}€
            </li>
          ))
        ) : (
          <p>Ei lisättyjä tapahtumia.</p>
       )}
      </ul>

      <button onClick={handleSave} style={{ backgroundColor: "blue", color: "white", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
        💾 Tallenna
      </button>
      <button onClick={() => navigate("/budget-list")} style={{ backgroundColor: "gray", color: "white", padding: "10px", borderRadius: "5px", marginLeft: "10px" }}>
        🔙 Takaisin
      </button>
    </div>
  );
};

export default EditBudget;
