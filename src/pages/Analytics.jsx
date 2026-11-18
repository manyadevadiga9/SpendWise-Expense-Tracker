
import { useState } from "react";

function Analytics({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const availableSavings = totalIncome - totalExpenses;
// Monthly Report Calculations
const monthlyTransactions = transactions.filter((transaction) => {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(transaction.date) &&
    transaction.date.startsWith(selectedMonth)
  );
});

const monthlyIncome = monthlyTransactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + transaction.amount, 0);

const monthlyExpenses = monthlyTransactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((total, transaction) => total + transaction.amount, 0);

const monthlySavings = monthlyIncome - monthlyExpenses;
// Monthly Expense Trend
const monthlyExpenseData = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - (5 - i));

  const month = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  const amount = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        /^\d{4}-\d{2}-\d{2}$/.test(transaction.date) &&
        transaction.date.startsWith(month)
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    amount,
  };
});

const maxMonthlyExpense = Math.max(
  ...monthlyExpenseData.map((item) => item.amount),
  1
);
  // Get current week's dates
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  // Weekly spending data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    const dayExpenses = transactions
      .filter((transaction) => {
        if (transaction.type !== "expense") return false;

        // Only process dates in YYYY-MM-DD format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)) {
          return false;
        }

        const [year, month, day] = transaction.date.split("-").map(Number);
        const transactionDate = new Date(year, month - 1, day);

        return transactionDate.toDateString() === currentDay.toDateString();
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      day: currentDay.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: dayExpenses,
    };
  });

  const maxWeeklyAmount = Math.max(
    ...weeklyData.map((item) => item.amount),
    1
  );

  // Category-wise spending
  const categoryData = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((categories, transaction) => {
      const name = transaction.category;

      categories[name] =
        (categories[name] || 0) + transaction.amount;

      return categories;
    }, {});

  const categoryList = Object.entries(categoryData)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const highestCategory = categoryList.length > 0
    ? categoryList[0]
    : null;

  return (
    <main className="main-content">
      <header className="top-header">
        <div>
          <p className="welcome-text">UNDERSTAND YOUR MONEY</p>
          <h1>Analytics</h1>
          <p className="subtitle">
            Analyze your income and spending patterns.
          </p>
        </div>
      </header>
      {/* Monthly Report */}
<section className="panel monthly-report-panel">
  <div className="panel-header">
    <div>
      <h3>Monthly Report</h3>
      <p>Track your income, expenses and savings by month</p>
    </div>

    <input
      type="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    />
  </div>

  <div className="monthly-report-grid">
    <div>
      <span>Monthly Income</span>
      <h2>₹{monthlyIncome.toLocaleString("en-IN")}</h2>
    </div>

    <div>
      <span>Monthly Expenses</span>
      <h2>₹{monthlyExpenses.toLocaleString("en-IN")}</h2>
    </div>

    <div>
      <span>Monthly Savings</span>
      <h2>₹{monthlySavings.toLocaleString("en-IN")}</h2>
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
      {/* Monthly Expense Trend */}
<section className="panel spending-panel">
  <div className="panel-header">
    <div>
      <h3>Monthly Expense Trend</h3>
      <p>Compare your expenses over the last 6 months</p>
    </div>
    <span className="period-label">Last 6 Months</span>
  </div>

  <div className="chart">
    {monthlyExpenseData.map((item) => (
      <div className="chart-column" key={item.month}>
        <span className="bar-value">
          ₹{item.amount.toLocaleString("en-IN")}
        </span>

        <div className="bar-container">
          <div
            className={`bar ${
              item.amount === maxMonthlyExpense && item.amount > 0
                ? "highlight-bar"
                : ""
            }`}
            style={{
              height: `${(item.amount / maxMonthlyExpense) * 100}%`,
            }}
          ></div>
        </div>

        <span className="day-label">{item.month}</span>
      </div>
    ))}
  </div>
</section>

      {/* Weekly Spending Chart */}
      <section className="panel spending-panel">
        <div className="panel-header">
          <div>
            <h3>Weekly Spending</h3>
            <p>Your expenses throughout the week</p>
          </div>
          <span className="period-label">This Week</span>
        </div>

        <div className="chart">
          {weeklyData.map((item) => (
            <div className="chart-column" key={item.day}>
              <span className="bar-value">
                ₹{item.amount.toLocaleString("en-IN")}
              </span>

              <div className="bar-container">
                <div
                  className={`bar ${
                    item.amount === maxWeeklyAmount && item.amount > 0
                      ? "highlight-bar"
                      : ""
                  }`}
                  style={{
                    height: `${
                      (item.amount / maxWeeklyAmount) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <span className="day-label">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category-wise Spending */}
      <section className="panel spending-panel">
        <div className="panel-header">
          <div>
            <h3>Spending by Category</h3>
            <p>See where your money goes</p>
          </div>
        </div>

        {categoryList.length > 0 ? (
          <div className="category-analytics">
            {categoryList.map((category) => (
              <div className="analytics-category" key={category.name}>
                <div className="analytics-category-info">
                  <strong>{category.name}</strong>
                  <strong>
                    ₹{category.amount.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="analytics-progress">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${
                        (category.amount / totalExpenses) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No expense data available yet.</p>
        )}

        {highestCategory && (
          <div className="highest-category">
            <span>Highest Spending Category</span>
            <h3>{highestCategory.name}</h3>
            <strong>
              ₹{highestCategory.amount.toLocaleString("en-IN")}
            </strong>
          </div>
        )}
      </section>
    </main>
  );
}

export default Analytics;
