

function Categories({ transactions }) {
    const categoryDetails = [
    { name: "Food & Groceries", color: "#a78bfa", icon: "🛒" },
    { name: "Shopping", color: "#38bdf8", icon: "🛍️" },
    { name: "Transport", color: "#34d399", icon: "🚗" },
    { name: "Entertainment", color: "#fbbf24", icon: "🎬" },
    { name: "Salary", color: "#60a5fa", icon: "💰" },
    { name: "Personal", color: "#fb7185", icon: "👤" },
    { name: "Other", color: "#94a3b8", icon: "📦" },
  ];

  const categories = categoryDetails.map((category) => {
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === category.name
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      ...category,
      amount,
    };
  }).filter((category) => category.amount > 0);

  const totalExpenses = categories.reduce(
    (total, category) => total + category.amount,
    0
  );
    return (
    <main className="main-content">
      <header className="top-header">
        <div>
          <p className="welcome-text">ORGANIZE YOUR EXPENSES</p>
          <h1>Categories</h1>
          <p className="subtitle">
            Track where your money goes by category.
          </p>
        </div>
      </header>

      <section className="panel category-panel">
        <div className="panel-header">
          <div>
            <h3>Expense Categories</h3>
            <p>Your spending breakdown</p>
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div className="category-item" key={category.name}>
              <div className="category-info">
                <span>{category.icon} {category.name}</span>
<strong>₹{category.amount.toLocaleString("en-IN")}</strong>              </div>

              <div className="category-track">
                <div
                  className="category-fill"
                  style={{
width: `${
  totalExpenses > 0
    ? (category.amount / totalExpenses) * 100
    : 0
}%`,                    backgroundColor: category.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Categories;
