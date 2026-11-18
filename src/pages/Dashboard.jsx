
import { useState, useEffect } from "react";

function Dashboard({
  transactions,
  setTransactions,
  monthlyBudget,
  setMonthlyBudget,
}) {
  const [showForm, setShowForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [newBudget, setNewBudget] = useState(monthlyBudget);
  const [type, setType] = useState("Expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Groceries");
  const [date, setDate] = useState("");

  // Keep budget input synchronized
  useEffect(() => {
    setNewBudget(monthlyBudget);
  }, [monthlyBudget]);

  // Calculate Total Income
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate Total Expenses
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate Balance and Savings
  const availableSavings = totalIncome - totalExpenses;

  // Calculate Budget Percentage safely
  const budgetPercentage =
    monthlyBudget > 0
      ? Math.min((totalExpenses / monthlyBudget) * 100, 100)
      : 0;

  // Budget Status
  const budgetStatus =
    monthlyBudget === 0
      ? "No Budget"
      : totalExpenses >= monthlyBudget
      ? "Over Budget"
      : totalExpenses >= monthlyBudget * 0.75
      ? "Warning"
      : "Normal";

  // Save Monthly Budget
  const handleSaveBudget = (e) => {
    e.preventDefault();

    if (newBudget === "" || Number(newBudget) < 0) {
      alert("Please enter a valid budget.");
      return;
    }

    setMonthlyBudget(Number(newBudget));
    setShowBudgetForm(false);
  };

  // Save Transaction
  const handleSaveTransaction = (e) => {
    e.preventDefault();

    if (
      !description.trim() ||
      !amount ||
      Number(amount) <= 0 ||
      !date
    ) {
      alert("Please enter valid transaction details.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: description.trim(),
      category: category,
      date: date,
      amount: Number(amount),
      icon: type === "Income" ? "💰" : "💸",
      type: type.toLowerCase(),
    };

    setTransactions((prevTransactions) => [
      newTransaction,
      ...prevTransactions,
    ]);

    setShowForm(false);
    setDescription("");
    setAmount("");
    setCategory("Food & Groceries");
    setDate("");
    setType("Expense");
  };

  return (
    <main className="main-content">
      <header className="top-header">
        <div>
          <p className="welcome-text">WELCOME BACK 👋</p>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Here's what's happening with your money today.
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Transaction
        </button>
      </header>

      {/* Balance Card */}
      <section className="balance-card">
        <div className="balance-top">
          <div>
            <p>Total Balance</p>
            <h2>₹{availableSavings.toLocaleString("en-IN")}</h2>

            <span className="balance-status">
              {availableSavings > 0
                ? "↗ Your finances are looking good!"
                : availableSavings < 0
                ? "↓ Your expenses are higher than income"
                : "Start tracking your money today!"}
            </span>
          </div>

          <div className="balance-icon">💳</div>
        </div>

        <div className="balance-footer">
          <div>
            <span>Monthly Budget</span>
            <h3>₹{monthlyBudget.toLocaleString("en-IN")}</h3>

            <button
              className="edit-budget-button"
              onClick={() => {
                setNewBudget(monthlyBudget);
                setShowBudgetForm(true);
              }}
            >
              ✏️ Edit Budget
            </button>
          </div>

          <div className="budget-progress">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>

            <small>
              {budgetPercentage.toFixed(1)}% of budget used
            </small>

            <p
              className={`budget-status ${budgetStatus
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {budgetStatus === "No Budget" &&
                "⚪ Set a budget to track your spending."}

              {budgetStatus === "Normal" &&
                "🟢 Your spending is under control!"}

              {budgetStatus === "Warning" &&
                "🟡 Careful! You have used 75% of your budget."}

              {budgetStatus === "Over Budget" &&
                "🔴 You have exceeded your monthly budget!"}
            </p>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="summary-grid">
        <div className="summary-card">
          <div className="summary-heading">
            <span>Total Income</span>
            <div className="summary-icon income-icon">↗</div>
          </div>

          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <p className="positive">Total recorded income</p>
        </div>

        <div className="summary-card">
          <div className="summary-heading">
            <span>Total Expenses</span>
            <div className="summary-icon expense-icon">↘</div>
          </div>

          <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
          <p className="negative">Total recorded expenses</p>
        </div>

        <div className="summary-card">
          <div className="summary-heading">
            <span>Available Savings</span>
            <div className="summary-icon savings-icon">◈</div>
          </div>

          <h2>₹{availableSavings.toLocaleString("en-IN")}</h2>
          <p className="positive">Income minus expenses</p>
        </div>
      </section>

      <footer className="footer">
        Made with 💜 SpendWise Expense Tracker © 2026
      </footer>

      {/* Add Transaction Popup */}
      {showForm && (
        <div className="add-transaction-overlay">
          <div className="add-transaction-card">
            <h2>Add New Transaction</h2>
            <p>Enter your transaction details below.</p>

            <form onSubmit={handleSaveTransaction}>
              <label>Transaction Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Expense</option>
                <option>Income</option>
              </select>

              <label>Description</label>

              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Amount</label>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food & Groceries</option>
                <option>Shopping</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Salary</option>
                <option>Other</option>
              </select>

              <label>Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <div className="add-transaction-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Monthly Budget Popup */}
      {showBudgetForm && (
        <div className="add-transaction-overlay">
          <div className="add-transaction-card">
            <h2>Set Monthly Budget</h2>
            <p>Choose how much you want to spend each month.</p>

            <form onSubmit={handleSaveBudget}>
              <label>Monthly Budget Amount (₹)</label>

              <input
                type="number"
                placeholder="Enter your budget"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
              />

              <div className="add-transaction-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowBudgetForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
