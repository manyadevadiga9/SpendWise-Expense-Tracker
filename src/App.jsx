
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "./App.css";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

function getUserTransactions(user) {
  if (!user) return [];

  try {
    return JSON.parse(
      localStorage.getItem(`transactions_${user.email}`)
    ) || [];
  } catch {
    return [];
  }
}

function getUserBudget(user) {
  if (!user) return 0;

  try {
    return Number(
      JSON.parse(localStorage.getItem(`budget_${user.email}`))
    ) || 0;
  } catch {
    return 0;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      return [];
    }
  });

  const [showSignup, setShowSignup] = useState(false);

  // Load saved financial data immediately for the logged-in user
  const [transactions, setTransactions] = useState(() =>
    getUserTransactions(getSavedUser())
  );

  const [monthlyBudget, setMonthlyBudget] = useState(() =>
    getUserBudget(getSavedUser())
  );

  // Save registered users
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  // Save login session
useEffect(() => {
  if (currentUser) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );
  } else {
    localStorage.removeItem("currentUser");
  }
}, [currentUser]);

  // Save financial data for the current user
  useEffect(() => {
    if (!currentUser) return;

    localStorage.setItem(
      `transactions_${currentUser.email}`,
      JSON.stringify(transactions)
    );

    localStorage.setItem(
      `budget_${currentUser.email}`,
      JSON.stringify(monthlyBudget)
    );
  }, [transactions, monthlyBudget, currentUser]);

  // Sign up
  const handleSignup = (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      alert("An account with this email already exists!");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    setUsers((previousUsers) => [
      ...previousUsers,
      newUser,
    ]);

    setShowSignup(false);
  };

  // Login
  const handleLogin = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
    );

    if (!existingUser) {
      alert("Invalid email or password!");
      return;
    }

    const savedTransactions = getUserTransactions({
      email: normalizedEmail,
    });

    const savedBudget = getUserBudget({
      email: normalizedEmail,
    });

    setTransactions(savedTransactions);
    setMonthlyBudget(savedBudget);

    setCurrentUser({
      name: existingUser.name,
      email: normalizedEmail,
    });
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setTransactions([]);
    setMonthlyBudget(0);
    setShowSignup(false);
  };

  return (
    <BrowserRouter>
      {currentUser ? (
        <div className="app-container">
          <Sidebar
            onLogout={handleLogout}
            currentUser={currentUser}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  transactions={transactions}
                  setTransactions={setTransactions}
                  monthlyBudget={monthlyBudget}
                  setMonthlyBudget={setMonthlyBudget}
                />
              }
            />

            <Route
              path="/transactions"
              element={
                <Transactions
                  transactions={transactions}
                  setTransactions={setTransactions}
                />
              }
            />

            <Route
              path="/analytics"
              element={<Analytics transactions={transactions} />}
            />

            <Route
              path="/categories"
              element={<Categories transactions={transactions} />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route
            path="/auth"
            element={
              showSignup ? (
                <Signup
                  onSignup={handleSignup}
                  onSwitchToLogin={() => setShowSignup(false)}
                />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSwitchToSignup={() => setShowSignup(true)}
                />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/auth" replace />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
