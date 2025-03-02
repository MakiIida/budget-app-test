import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Valikko</h3>
      <ul>
        <li>
          <Link to="/dashboard">📊 Etusivu</Link>
        </li>
        <li>
          <Link to="/budget-list">💾 Tallennetut budjetit</Link>
        </li>
        <li>
          <Link to="/new-budget">➕ Luo uusi budjetti</Link>
        </li>
        <li>
          <Link to="/settings">⚙️ Asetukset</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
