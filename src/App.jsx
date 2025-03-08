import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BudgetList from "./pages/BudgetList";
import NewBudget from "./pages/NewBudget";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import EditBudget from "./pages/EditBudget";

import "./App.css";
import "./styles.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext); // Käytä autentikaation tilaa

  return (
    <div className="container">
      {/* Otsikko pysyy kaikilla sivuilla */}
      <h1 style={{ textAlign: "center", color: "black", fontSize: "53px", fontWeight: "bold" }}>Budjettisovellus</h1>

      <Routes>
        <Route path="/" element={<h2>Tervetuloa Budjettisovellukseen!</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/budget-list" element={<BudgetList />} />
        <Route path="/new-budget" element={<NewBudget />} />
        <Route path="/edit-budget/:id" element={<EditBudget />} />
      </Routes>
    </div>
  );
}

export default App;

