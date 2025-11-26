"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Form = {
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  total_seats: number;
  category: string;
  location: string;
  is_paid: boolean;
};

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const accessToken = session?.accessToken
  const isEO = role === "ORGANIZER" || role === "ADMIN";

  const [form, setForm] = useState<Form>({
    name: "",
    description: "",
    price: 0,
    start_date: "",
    end_date: "",
    total_seats: 1,
    category: "",
    location: "",
    is_paid: true,
  });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !isEO) {
      setStatusMsg("Organizer only");
    }
  }, [status, isEO]);

  const set = (k: keyof Form, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!accessToken) return setStatusMsg("Missing auth token");
    if (!isEO) return setStatusMsg("Organizer only");

    setLoading(true);
    setStatusMsg(null);
    try {
        console.log(accessToken)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      if (!res.ok) { console.error("Create error:", res.status, text); throw new Error(text || res.statusText); }
      setStatusMsg("Event created!");
    } catch (err: any) {
      setStatusMsg(err.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-700">Create Event</h1>
      <form onSubmit={submit} className="space-y-3">
        <span className="text-gray-700 text-sm">Event Name</span>
        <input className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <span className="text-gray-700 text-sm">Description</span>
        <textarea className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
        <span className="text-gray-700 text-sm">Price</span>
        <input type="number" className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Price" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols- text-gray-700">
          <label className="flex flex-col text-sm text-gray-700">
            Start date/time
            <input type="datetime-local" className="rounded border px-3 py-2 " value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">
            End date/time
            <input type="datetime-local" className="rounded border px-3 py-2" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
          </label>
        </div>
        <span className="text-gray-700 text-sm">Total Seats</span>
        <input type="number" className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Total seats" value={form.total_seats} onChange={(e) => set("total_seats", Number(e.target.value))} />
        <span className="text-gray-700 text-sm">Category</span>
        <input className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Category" value={form.category} onChange={(e) => set("category", e.target.value)} />
        <span className="text-gray-700 text-sm">Location</span>
        <input className="w-full rounded border px-3 py-2 text-gray-700" placeholder="Location" value={form.location} onChange={(e) => set("location", e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_paid} onChange={(e) => set("is_paid", e.target.checked)} />
          <span className="text-gray-700">Paid event</span>
        </label>
        <button type="submit" disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">
          {loading ? "Creating..." : "Create Event"}
        </button>
        {statusMsg && <p className="text-sm text-red-600">{statusMsg}</p>}
      </form>
    </main>
  );
}
