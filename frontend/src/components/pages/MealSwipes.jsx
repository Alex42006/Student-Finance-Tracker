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
    <div className="mealswipes-container">
      <h2>Meal Swipes</h2>
      <div className="mealswipes-card">
        <input
          type="number"
          placeholder="Total Swipes"
          value={swipesTotal}
          onChange={(e) => {
            const v = e.target.value;
            setSwipesTotal(v === "" ? "" : Math.max(0, parseInt(v)));
          }}
        />

        <input
          type="number"
          placeholder="Swipes Used"
          value={swipesUsed}
          onChange={(e) => {
            const v = e.target.value;
            setSwipesUsed(v === "" ? "" : Math.max(0, parseInt(v)));
          }}
        />

        <p className="mealswipes-remaining">
          Remaining: {Math.max(0, swipesTotal - swipesUsed)}
        </p>

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default MealSwipes;
