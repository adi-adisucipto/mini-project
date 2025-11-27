"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Tx = {
  transaction_id: string;
  customer: { username: string; email: string };
  event: { name: string };
  payment_proof_url?: string | null;
  statusPay: string;
};

export default function EOTransactions() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTx = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eo/transactions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTx(); }, [accessToken]);

  const update = async (id: string, action: "accept" | "reject") => {
    if (!accessToken) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eo/transactions/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const t = await res.text();
      return alert(t || "Failed");
    }
    fetchTx();
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Transaction Management</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {items.map((tx, i) => (
          <article key={tx.transaction_id} className="rounded bg-gray-100 p-4 shadow">
            <p className="text-sm text-gray-600">Transaction #{i + 1}</p>
            <p className="text-xs font-semibold mt-2">Buyer Name</p>
            <p className="font-semibold">{tx.customer.username || tx.customer.email}</p>
            <p className="text-xs font-semibold mt-2">Event Name</p>
            <p className="font-semibold">{tx.event.name}</p>
            <p className="text-xs font-semibold mt-2">Payment Proof</p>
            {tx.payment_proof_url ? (
              <a href={tx.payment_proof_url} target="_blank" className="text-blue-600 underline">View proof</a>
            ) : (
              <div className="h-32 w-full bg-gray-300" />
            )}
            <div className="mt-4 flex gap-3">
              <button onClick={() => update(tx.transaction_id, "reject")} className="rounded bg-gray-300 px-4 py-2">Reject</button>
              <button onClick={() => update(tx.transaction_id, "accept")} className="rounded bg-gray-700 px-4 py-2 text-white">Accept</button>
            </div>
          </article>
        ))}
        {items.length === 0 && !loading && <p>No transactions.</p>}
      </div>
    </main>
  );
}
