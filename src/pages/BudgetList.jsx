import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Tämä lisätty, jotta voidaan navigoida muokkaussivulle

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
        setBudgets(data);
      } catch (error) {
        console.error("❌ Virhe budjettien hakemisessa:", error);
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
      console.error("❌ Virhe budjetin poistamisessa:", error);
      setError(error.message);
    }
  };

  return (
    <div className="budget-list" style={{ textAlign: "center", color: "black" }}>
      <h2>📋 Tallennetut budjetit</h2>

      {loading ? (
        <p>⏳ Ladataan budjetteja...</p>
      ) : error ? (
        <p style={{ color: "red" }}>⚠️ {error}</p>
      ) : budgets.length === 0 ? (
        <p>Ei tallennettuja budjetteja.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {budgets.map((budget) => (
            <li key={budget.id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <strong>📅 {budget.month} / {budget.year}</strong><br />
              🔵 Tulot: <strong>{budget.income}€</strong><br />
              🔴 Menot: <strong>{budget.expenses}€</strong><br />
              💰 Yhteensä: <strong>{budget.income - budget.expenses}€</strong><br />

              <button
                onClick={() => navigate(`/edit-budget/${budget.id}`)} // Ohjaa muokkaussivulle
                style={{ marginTop: "5px", backgroundColor: "orange", color: "white", padding: "5px", borderRadius: "5px", marginRight: "10px" }}
              >
                ✏️ Muokkaa
              </button>

              <button
                onClick={() => handleDelete(budget.id)}
                style={{ marginTop: "5px", backgroundColor: "red", color: "white", padding: "5px", borderRadius: "5px" }}
              >
                🗑️ Poista
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BudgetList;