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

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Done: "text-green-600",
    WaitingConfirm: "text-orange-500",
    WaitingPay: "text-yellow-500",
    Rejected: "text-red-600",
    Expired: "text-gray-500",
    Canceled: "text-gray-500",
  };
  return <span className={`text-sm font-semibold ${styles[status] || ""}`}>{status}</span>;
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
          <article key={tx.transaction_id} className="rounded bg-gray-100 p-4 shadow space-y-3">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>Transaction #{i + 1}</span>
              <StatusBadge status={tx.statusPay} />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-xs text-gray-500">Buyer Name</p>
              <p className="font-semibold">{tx.customer.username || tx.customer.email}</p>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-xs text-gray-500">Event Name</p>
              <p className="font-semibold">{tx.event.name}</p>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-xs text-gray-500">Payment Proof</p>
              {tx.payment_proof_url ? (
                <a href={tx.payment_proof_url} target="_blank" className="text-blue-600 underline">View proof</a>
              ) : (
                <div className="h-32 w-full rounded bg-gray-300" />
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => update(tx.transaction_id, "reject")}
                disabled={tx.statusPay !== "WaitingConfirm"}
                className="flex-1 rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => update(tx.transaction_id, "accept")}
                disabled={tx.statusPay !== "WaitingConfirm"}
                className="flex-1 rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && !loading && <p>No transactions.</p>}
      </div>
    </main>
  );
}
