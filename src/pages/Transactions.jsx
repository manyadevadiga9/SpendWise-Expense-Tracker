
import { useState } from "react";

function Transactions({ transactions, setTransactions }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("Expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Groceries");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

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
      name: description,
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
    setType("Expense");
    setDescription("");
    setAmount("");
    setCategory("Food & Groceries");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // Search and Filter Transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "All" || transaction.type === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <main className="main-content">
      <header className="top-header">
        <div>
          <p className="welcome-text">MANAGE YOUR MONEY</p>
          <h1>Transactions</h1>
          <p className="subtitle">
            View and manage all your income and expenses.
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Transaction
        </button>
      </header>

      <section className="panel transactions-panel">
        <div className="panel-header">
          <div>
            <h3>All Transactions</h3>
            <p>Your recent financial activities</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="transaction-filters">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Transactions</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expenses Only</option>
          </select>
        </div>

        <div className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <div className="transaction-left">
                <div className="transaction-icon">
                  {transaction.icon}
                </div>

                <div>
                  <h4>{transaction.name}</h4>
                  <p>
                    {transaction.category} · {transaction.date}
                  </p>
                </div>
              </div>

              <div className="transaction-actions">
                <strong
                  className={
                    transaction.type === "income"
                      ? "transaction-income"
                      : "transaction-expense"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString("en-IN")}
                </strong>

                <button
                  className="delete-button"
                  onClick={() => {
                    setTransactionToDelete(transaction);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <p>No matching transactions found.</p>
          )}
        </div>
      </section>

      {/* Add Transaction Glass Popup */}
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

      {/* Delete Confirmation Glass Popup */}
      {showDeleteModal && (
        <div className="glass-overlay">
          <div className="glass-card">
            <div className="glass-icon">🗑️</div>

            <h2>Delete Transaction?</h2>

            <p>
              Are you sure you want to delete
              <strong> {transactionToDelete?.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="glass-buttons">
              <button
                className="cancel-delete"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTransactionToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={() => {
                  setTransactions((prevTransactions) =>
                    prevTransactions.filter(
                      (item) => item.id !== transactionToDelete.id
                    )
                  );

                  setShowDeleteModal(false);
                  setTransactionToDelete(null);
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Transactions;
