import { useEffect, useState } from "react";

export function useTransactions() {
  const [data, setData]   = useState([]);
  const [loading, setL]   = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TEMP MOCK: replace with fetch('/api/transactions') when backend route exists
    const timer = setTimeout(() => {
      setData([
        { id: "tx_1", date: new Date().toISOString(), description: "Coffee", category: "Food", type: "expense", amount: -4.25 },
        { id: "tx_2", date: new Date().toISOString(), description: "Paycheck", category: "Income", type: "income", amount: 120.00 }
      ]);
      setL(false);
    }, 200);

    // REAL FETCH (enable once Alex exposes the endpoint)
    // fetch('/api/transactions')
    //   .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
    //   .then(json => Array.isArray(json) ? setData(json) : setData(json.items ?? []))
    //   .catch(e => setError(e.message))
    //   .finally(() => setL(false));

    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error };
}
