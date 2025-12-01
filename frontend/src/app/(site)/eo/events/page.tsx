"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EOEventsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const [events, setEvents] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const fetchEvents = async () => {
    if (!token) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eo/events`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (res.ok) setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const startEdit = (ev: any) => { setEditing(ev.event_id); setForm(ev); };

  const save = async () => {
    if (!token || !editing) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eo/events/${editing}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) { setEditing(null); fetchEvents(); } else { alert("Failed to update"); }
  };

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4 text-gray-800">
      <h1 className="text-2xl font-semibold">My Events</h1>
      {events.map((ev) => (
        <article key={ev.event_id} className="rounded bg-gray-100 p-4 shadow space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">{ev.name}</span>
            <button onClick={() => startEdit(ev)} className="text-blue-600">Edit</button>
          </div>
          {editing === ev.event_id ? (
            <div className="space-y-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border px-3 py-2" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded border px-3 py-2" />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded border px-3 py-2" />
              <input type="number" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })} className="w-full rounded border px-3 py-2" />
              <input type="datetime-local" value={form.start_date?.slice(0,16)} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded border px-3 py-2" />
              <input type="datetime-local" value={form.end_date?.slice(0,16)} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full rounded border px-3 py-2" />
              <button onClick={save} className="rounded bg-black px-4 py-2 text-white">Save</button>
              <button onClick={() => setEditing(null)} className="ml-2 rounded bg-gray-300 px-4 py-2">Cancel</button>
            </div>
          ) : (
            <>
              <p>{ev.description}</p>
              <p>Price: {ev.price}</p>
              <p>Seats: {ev.available_seats}/{ev.total_seats}</p>
              <p>Dates: {new Date(ev.start_date).toLocaleString()} – {new Date(ev.end_date).toLocaleString()}</p>
            </>
          )}
        </article>
      ))}
    </main>
  );
}
