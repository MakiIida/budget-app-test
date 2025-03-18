import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BudgetList from "./pages/BudgetList";
import NewBudget from "./pages/NewBudget";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import EditBudget from "./pages/EditBudget";
import Savings from "./pages/Savings";
import "./App.css";
import "./styles.css";
import React from "react";


/**
 * Sovelluksen pääkomponentti, joka asettaa kontekstin ja reitityksen.
 */
function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

/**
 * MainApp vastaa käyttöliittymän reitityksestä ja näyttää pääotsikon.
 * Käyttää AuthContextia tarkistaakseen, onko käyttäjä kirjautunut sisään.
 */
function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container">
      {/* Otsikko kaikille sivuille */}
      <h1 style={{ textAlign: "center", color: "black", fontSize: "53px", fontWeight: "bold" }}>
        Budjettisovellus
      </h1>

      <Routes>
        <Route path="/" element={<h2>Tervetuloa Budjettisovellukseen!</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/budget-list" element={<BudgetList />} />
        <Route path="/new-budget" element={<NewBudget />} />
        <Route path="/edit-budget/:id" element={<EditBudget />} />
        <Route path="/savings" element={<Savings />} />
      </Routes>
    </div>
  );
}

export default App;
