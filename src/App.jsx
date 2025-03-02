import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
      <h1>Budjettisovellus</h1>

      {/* Näytetään Kirjaudu sisään / Rekisteröidy vain jos käyttäjä EI ole kirjautunut */}
      {!isAuthenticated && (
        <nav>
          <Link to="/login"><button>Kirjaudu sisään</button></Link>
          <Link to="/register"><button>Rekisteröidy</button></Link>
        </nav>
      )}

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
