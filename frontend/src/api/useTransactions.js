import { useEffect, useState } from "react";

export function useTransactions() {
  const [data, setData] = useState([]);
  const [loading, setL] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { id: "tx_1", date: new Date().toISOString(), description: "Coffee", category: "Food", type: "expense", amount: -4.25 },
        { id: "tx_2", date: new Date().toISOString(), description: "Paycheck", category: "Income", type: "income", amount: 120.00 }
      ]);
      setL(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error };
}
