import React, { useEffect, useState } from "react";
import "./Transactions.css";

const DiningExpenses = () => {
  const [amount, setAmount] = useState("");
  const [monthTotal, setMonthTotal] = useState(0);
  const [budget, setBudget] = useState("");

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = 1;

  const fetchMonthTotal = async () => {
    try {
      const res = await fetch(
        `http://localhost:${port}/transactions/dining/total?userID=${userID}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setMonthTotal(data.total ?? 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMonthTotal();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) return;

    await fetch(`http://localhost:${port}/transactions/dining/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        amount: n,
      }),
    });

    setAmount("");
    fetchMonthTotal();
  };

  const onAmount = (e) => {
    const v = e.target.value;
    if (v === "") setAmount("");
    else {
      const n = Math.max(0, parseFloat(v));
      setAmount(Number.isFinite(n) ? String(n) : "");
    }
  };

  const onBudget = (e) => {
    const v = e.target.value;
    if (v === "") setBudget("");
    else {
      const n = Math.max(0, parseFloat(v));
      setBudget(Number.isFinite(n) ? String(n) : "");
    }
  };

  const remaining =
    budget === ""
      ? ""
      : Math.max(0, parseFloat(budget) - monthTotal).toFixed(2);

  return (
    <div className="page-container">
      <h1 className="page-title">Dining Expenses</h1>

      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={onAmount}
          min="0"
          style={inputStyle}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Monthly Budget (optional)"
          value={budget}
          onChange={onBudget}
          min="0"
          style={inputStyle}
        />

        <button type="submit" style={addButton}>
          Add Dining Expense
        </button>
      </form>

      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          padding: "16px 20px",
          borderRadius: 12,
          color: "#fff",
          fontSize: 18,
        }}
      >
        <p style={{ marginBottom: 8 }}>
          <strong>This month total:</strong> ${monthTotal.toFixed(2)}
        </p>

        {budget !== "" ? (
          <>
            <p style={{ marginBottom: 4 }}>
              <strong>Monthly budget:</strong> ${parseFloat(budget).toFixed(2)}
            </p>
            <p>
              <strong>Remaining:</strong> ${remaining}
            </p>
          </>
        ) : (
          <p style={{ opacity: 0.8 }}>
            No dining budget set. 
          </p>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  flex: "1 1 160px",
};

const addButton = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  flex: "1 1 160px",
};

export default DiningExpenses;
