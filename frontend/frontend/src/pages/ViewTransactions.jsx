import { useTransactions } from "../api/useTransactions";

export default function ViewTransactions() {
  const { data, loading, error } = useTransactions();

  if (loading) return <div className="p-4">Loading transactions…</div>;
  if (error)   return <div className="p-4">Error: {error}</div>;
  if (!data.length) return <div className="p-4">No transactions yet.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl" style={{ fontWeight: 600, marginBottom: 12 }}>Transactions</h1>
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Date","Description","Category","Type","Amount"].map(h => (
              <th key={h} style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(t => (
            <tr key={t.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{new Date(t.date).toLocaleDateString()}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{t.description}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{t.category}</td>
              <td style={{ border: "1px solid #ddd", padding: 8, textTransform:"capitalize" }}>{t.type}</td>
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign:"right" }}>
                {Number(t.amount).toLocaleString(undefined, { style:"currency", currency:"USD" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
