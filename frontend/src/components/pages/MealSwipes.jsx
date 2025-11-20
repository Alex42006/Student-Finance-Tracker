import React, { useState } from "react";
import "./MealSwipes.css";

const MealSwipes = () => {
  const [swipesTotal, setSwipesTotal] = useState(14);
  const [swipesUsed, setSwipesUsed] = useState(0);
  const port = import.meta.env.VITE_BACKEND_PORT;

  const handleSave = async () => {
    await fetch(`http://localhost:${port}/mealswipes/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: 1,
        swipesTotal,
        swipesUsed,
      }),
    });
  };
  return (
    <div className="page-container">
      <h1 className="page-title">Meal Swipes</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          color: "#fff",
        }}
      >
        <input
          type="number"
          placeholder="Total Swipes"
          value={swipesTotal}
          onChange={(e) => {
            const targetValue = e.target.value;
            if (targetValue === "") {
              setSwipesTotal("");
            } else {
              setSwipesTotal(Math.max(0, parseInt(targetValue, 0)));
            }
          }}
          min="0"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "16px",
          }}
        />

        <input
          type="number"
          placeholder="Swipes Used"
          value={swipesUsed}
          onChange={(e) => {
            const targetValue = e.target.value;
            if (targetValue === "") {
              setSwipesUsed("");
            } else {
              setSwipesUsed(Math.max(0, parseInt(targetValue, 0)));
            }
          }}
          min="0"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "16px",
          }}
        />

        <p style={{ textAlign: "center", fontSize: "18px", fontWeight: 600 }}>
          Remaining: {Math.max(0, swipesTotal - swipesUsed)}
        </p>

        <button
          onClick={handleSave}
          className="btn"
          style={{
            marginTop: 10,
            alignSelf: "center",
            padding: "10px 20px",
            borderRadius: "8px",
            background: "#4CAF50",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default MealSwipes;
