import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState('month');
  const [dashboardData, setDashboardData] = useState(null);
  const [financialAid, setFinancialAid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem('userID'));

useEffect(() => {
  if (!userID) return;  
  fetchDashboardData();
  fetchFinancialAid();
}, [timeFrame, userID]);


  const fetchFinancialAid = async () => {
    const res = await fetch(`http://localhost:${port}/financialAid?userID=${userID}`);
    const data = await res.json();
    setFinancialAid(data);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:${port}/dashboard?view=${timeFrame}&userID=${userID}`,
        {
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!dashboardData) return null;

  const { summary, charts, recentTransactions, upcomingSubscriptions } = dashboardData;

  const totalAid = financialAid.reduce((sum, fa) => sum + Number(fa.amountAwarded), 0);
  const nextDisbursement = financialAid
    .map(fa => new Date(fa.disbursementDate))
    .sort((a, b) => a - b)[0];

  const cleanDescription = (desc, category) =>
    desc
      .replace(new RegExp(category, "i"), "")
      .replace(/[-–]/g, "")
      .trim();    

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>GatorBudget Dashboard</h1>
        <div className="timeframe-selector">
          <button className={timeFrame === 'week' ? 'active' : ''} onClick={() => setTimeFrame('week')}>Week</button>
          <button className={timeFrame === 'month' ? 'active' : ''} onClick={() => setTimeFrame('month')}>Month</button>
          <button className={timeFrame === 'year' ? 'active' : ''} onClick={() => setTimeFrame('year')}>Year</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card balance-card">
          <h3>Total Balance</h3>
          <p className="card-value">${summary.totalBalance.toFixed(2)}</p>
          <span className={summary.balanceChange >= 0 ? 'positive' : 'negative'}>
            {summary.balanceChange >= 0 ? '↑' : '↓'} ${Math.abs(summary.balanceChange).toFixed(2)}
          </span>
        </div>

        <div className="card swipes-card">
          <h3>Meal Swipes</h3>
          <p className="card-value">{summary.remainingSwipes}</p>
          <span className="card-subtitle">of {summary.totalSwipes} remaining</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(summary.remainingSwipes / summary.totalSwipes) * 100}%` }} />
          </div>
        </div>

        <div className="card dining-card">
          <h3>Dining Dollars</h3>
          <p className="card-value">${summary.diningDollars.toFixed(2)}</p>
          <span className="card-subtitle">Available</span>
        </div>

        <div className="card subscriptions-card">
          <h3>Upcoming Payments</h3>
          <p className="card-value">${summary.upcomingPayments.toFixed(2)}</p>
          <span className="card-subtitle">Next 7 days</span>
        </div>

        <div className="card financial-aid-card">
          <h3>Financial Aid</h3>
          <p className="card-value">${totalAid.toFixed(2)}</p>
          {nextDisbursement && (
            <span className="card-subtitle">
              Next Disbursement: {nextDisbursement.toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="card budget-summary-card">
          <h3>Budgets</h3>
          <p className="card-value">
            {charts.budgets.filter(b => b.spent > b.limit).length}
          </p>
          <span className="card-subtitle">Over Budget Categories</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card income-expense-chart">
          <h3>Income vs Expenses</h3>
          <div className="chart-bars">
            <div className="bar-group">
              <div className="bar income-bar" style={{ height: `${(charts.income / Math.max(charts.income, charts.expenses)) * 200}px` }}>
                <span className="bar-label">${charts.income.toFixed(0)}</span>
              </div>
              <span className="bar-title">Income</span>
            </div>
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: `${(charts.expenses / Math.max(charts.income, charts.expenses)) * 200}px` }}>
                <span className="bar-label">${charts.expenses.toFixed(0)}</span>
              </div>
              <span className="bar-title">Expenses</span>
            </div>
          </div>
        </div>

        <div className="chart-card category-chart">
          <h3>Income by Category</h3>
          <div className="category-list">
            {charts.incomeCategories.map((cat, idx) => (
              <div key={idx} className="category-item">
                <div className="category-info">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-amount">${cat.amount.toFixed(2)}</span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{
                      width: `${(cat.amount / charts.totalIncome) * 100}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card budget-chart">
          <h3>Budgets and Spending</h3>
          <div className="budget-list">
            {charts.budgets.map((b, idx) => {
              const pct = Math.min((b.spent / b.limit) * 100, 100);
              return (
                <div key={idx} className="budget-item">
                  <div className="budget-info">
                    <span className="budget-name">{b.category}</span>
                    <span className="budget-amount">
                      ${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}
                    </span>
                  </div>

                  <div className="budget-bar">
                    <div
                      className={`budget-fill ${b.spent > b.limit ? "over-budget" : ""}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-card">
          <h3>Recent Transactions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn, idx) => (
                <tr key={idx}>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>
                    {cleanDescription(txn.description, txn.category)
                      .charAt(0)
                      .toUpperCase() +
                      cleanDescription(txn.description, txn.category).slice(1)}
                  </td>

                  <td>{txn.category}</td>
                  <td className={txn.type === 'income' ? 'positive' : 'negative'}>
                    {txn.type === 'income' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Upcoming Subscriptions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Next Payment</th>
                <th>Amount</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {upcomingSubscriptions.map((sub, idx) => (
                <tr key={idx}>
                  <td>{sub.name}</td>
                  <td>{new Date(sub.nextPayment).toLocaleDateString()}</td>
                  <td>${sub.amount.toFixed(2)}</td>
                  <td>{sub.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Financial Aid Disbursements</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Aid Type</th>
                <th>Amount</th>
                <th>Disbursement</th>
                <th>Term</th>
              </tr>
            </thead>
            <tbody>
              {financialAid.map(fa => (
                <tr key={fa.id}>
                  <td>{fa.aidType}</td>
                  <td>${fa.amountAwarded.toFixed(2)}</td>
                  <td>{fa.disbursementDate.split("T")[0]}</td>
                  <td>{fa.termSeason} {fa.termYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-card">
          <h3>Budget Information</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {charts.budgets.map((b, idx) => {
                const remaining = b.limit - b.spent;
                return (
                  <tr key={idx}>
                    <td>{b.category}</td>
                    <td>${b.limit.toFixed(2)}</td>
                    <td>${b.spent.toFixed(2)}</td>
                    <td>${remaining.toFixed(2)}</td>
                    <td className={remaining < 0 ? "negative" : "positive"}>
                      {remaining < 0 ? "Over" : "Under"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
