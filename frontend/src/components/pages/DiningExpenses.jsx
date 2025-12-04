import React, { useEffect, useState } from "react";
import "./DiningExpenses.css";

const DiningExpenses = () => {
  const [amount, setAmount] = useState("");
  const [monthTotal, setMonthTotal] = useState(0);
  const [budget, setBudget] = useState("");

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = Number(localStorage.getItem("userID"));

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
    if (userID) fetchMonthTotal();
  }, [userID]);

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
    <div className="dining-page">
      <h1 className="dining-title">Dining Expenses</h1>

      <form onSubmit={handleAdd} className="dining-form">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={onAmount}
          min="0"
          className="dining-input"
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Monthly Budget (optional)"
          value={budget}
          onChange={onBudget}
          min="0"
          className="dining-input"
        />

        <button type="submit" className="dining-submit">
          Add Dining Expense
        </button>
      </form>

      <div className="dining-summary">
        <p>
          <strong>This month total:</strong> ${monthTotal.toFixed(2)}
        </p>

        {budget !== "" ? (
          <>
            <p>
              <strong>Monthly budget:</strong> ${parseFloat(budget).toFixed(2)}
            </p>
            <p>
              <strong>Remaining:</strong> ${remaining}
            </p>
          </>
        ) : (
          <p className="dining-no-budget">No dining budget set.</p>
        )}
      </div>
    </div>
  );
};

export default DiningExpenses;
