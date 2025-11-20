import React, { useState, useEffect } from "react";
import "./MealSwipes.css";

const MealSwipes = () => {
  const [swipesTotal, setSwipesTotal] = useState("");
  const [swipesUsed, setSwipesUsed] = useState("");
  const [diningDollars, setDiningDollars] = useState("");
  const [mealSwipeId, setMealSwipeId] = useState(null);

  const port = import.meta.env.VITE_BACKEND_PORT;
  const userID = 1;

  const fetchMealSwipe = async () => {
    const res = await fetch(
      `http://localhost:${port}/mealswipes/getMealSwipeByUser/${userID}`
    );
    const data = await res.json();

    if (data) {
      setMealSwipeId(data.id);
      setSwipesTotal(String(data.swipesTotal));
      setSwipesUsed(String(data.swipesUsed));
      setDiningDollars(String(data.diningDollars));
    } else {
      setMealSwipeId(null);
      setSwipesTotal("");
      setSwipesUsed("");
      setDiningDollars("");
    }
  };

  useEffect(() => {
    fetchMealSwipe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${port}/mealswipes/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        swipesTotal: Number(swipesTotal || 0),
        swipesUsed: Number(swipesUsed || 0),
        diningDollars: Number(diningDollars || 0),
      }),
    });

    fetchMealSwipe();
  };

  const handleDelete = async () => {
    if (!mealSwipeId) return;

    await fetch(`http://localhost:${port}/mealswipes/delete/${mealSwipeId}`, {
      method: "DELETE",
    });

    setMealSwipeId(null);
    setSwipesTotal("");
    setSwipesUsed("");
    setDiningDollars("");
  };

  const remaining =
    swipesTotal && swipesUsed
      ? Number(swipesTotal) - Number(swipesUsed)
      : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">Meal Swipes</h1>

      <form
        onSubmit={handleSave}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <input
          type="number"
          placeholder="Total Swipes"
          value={swipesTotal}
          onChange={(e) =>
            setSwipesTotal(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Swipes Used"
          value={swipesUsed}
          onChange={(e) =>
            setSwipesUsed(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Dining Dollars"
          value={diningDollars}
          onChange={(e) =>
            setDiningDollars(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          style={inputStyle}
        />

        <p
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Remaining Swipes: {remaining}
        </p>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: "#4CAF50",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          {mealSwipeId ? "Update Meal Swipes" : "Save Meal Swipes"}
        </button>

        {mealSwipeId && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#ff5252",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
            }}
          >
            Delete Meal Swipe Record
          </button>
        )}
      </form>

      {/* Display Section (like Subscriptions) */}
      {mealSwipeId && (
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "16px 20px",
            borderRadius: 12,
            marginTop: 20,
            color: "#fff",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          <h3 style={{ marginBottom: 10, textAlign: "center" }}>
            Current Meal Swipe Data
          </h3>

          <p><strong>Total Swipes:</strong> {swipesTotal}</p>
          <p><strong>Swipes Used:</strong> {swipesUsed}</p>
          <p><strong>Remaining Swipes:</strong> {remaining}</p>
          <p><strong>Dining Dollars Remaining:</strong> ${diningDollars}</p>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: "16px",
};

export default MealSwipes;
