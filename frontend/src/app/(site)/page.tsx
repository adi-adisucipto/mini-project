// src/app/page.tsx
// jangan lupa buat sitemapping like this src/app/(site)/page.tsx src/app/(site)/layout.tsx biar isa bedain yang mana ada navbar and yang gada
import Link from "next/link";

type Event = {
  event_id: string;
  location: string;
};

async function getEvents(): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return [];
  try {
    const res = await fetch(`${base}/events`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {

  const events = await getEvents();

  const cityCounts = new Map<string, number>();
  for (const ev of events) {
    if (!ev.location) continue;
    cityCounts.set(ev.location, (cityCounts.get(ev.location) || 0) + 1);
  }
  const cities = Array.from(cityCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <main className=" bg-white">
      {/* hero banner */}
      <section className="mx-auto mt-6 w-full max-w-6xl px-6">
        <div>
          <img
      src="/banner.jpg"
      alt="Events banner"
      className="h-80 w-full object-cover rounded-xl"
    />
        </div>
      </section>

      {/* cities */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">Browse by city</h2>
        {cities.length === 0 ? (
          <p className="text-sm text-gray-500">No events available yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {cities.map(([city, count]) => (
              <Link
                key={city}
                href={`/browse?location=${encodeURIComponent(city)}`}
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3 hover:bg-[#F6A273]"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">{city}</p>
                  <p className="text-xs text-gray-500">{count} events</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* discount events */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">
          Discount promotion / Top Events
        </h2>
        <div className="h-40 w-full rounded-lg bg-gray-300">
          <img
      src="/banner-three.jpeg"
      alt="Events banner"
      className="h-40 w-full object-cover rounded-xl"
    />
        </div>
      </section>

      {/* events di location */}
      {/* <section className="mx-auto mt-10 w-full max-w-6xl px-6 pb-16">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Events in <span className="text-blue-500">Jakarta</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <article key={i} className="rounded-lg bg-gray-50 p-3 shadow-sm">
              <div className="mb-3 h-28 w-full rounded-md bg-gray-300" />
              <h3 className="text-sm font-semibold text-gray-700">
                Event in Jakarta
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Tuesday, Nov 18 6:00 PM
              </p>
              <p className="text-xs text-gray-500">
                Pondok Indah Mall, Ground Floor
              </p>
              <p className="mt-2 text-xs font-semibold">Free</p>
            </article>
          ))}
        </div>
      </section> */}
    </main>
  );
}
