
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ onLogout, currentUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMenu}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">₹</div>
          <h2>SpendWise</h2>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="navigation">
          <NavLink to="/" end className="nav-item" onClick={closeMenu}>
            🏠 Dashboard
          </NavLink>

          <NavLink to="/transactions" className="nav-item" onClick={closeMenu}>
            💳 Transactions
          </NavLink>

          <NavLink to="/analytics" className="nav-item" onClick={closeMenu}>
            📊 Analytics
          </NavLink>

          <NavLink to="/categories" className="nav-item" onClick={closeMenu}>
            📁 Categories
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <p>{currentUser?.name}</p>

          <button
            onClick={() => {
              closeMenu();
              onLogout();
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
