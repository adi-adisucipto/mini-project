// src/app/(site)/browse/page.tsx

//console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

import Link from "next/link";
import { LocationFilter } from "./LocationFilter";

type Event = {
  event_id: string;
  name: string;
  location: string;
  start_date: string;
  price: number;
  is_paid: boolean;
};

interface BrowsePageProps {
  searchParams: Promise<{ search?: string, location?: string; }>; //ini harus pake promise and await btw, km error karna no await yg bisa render
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const location = sp.location ??"";

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (location) params.set("location", location);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) {
    console.error("NEXT_PUBLIC_API_URL is not set");
  }

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/events`;
  const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;

  // fetch filtered events yang ini
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return (
      <main className="mx-auto mt-10 w-full max-w-6xl px-6 pb-16">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Search results
        </h2>
        <p className="text-sm text-red-500">Failed to load events.</p>
      </main>
    );
  }
  const events: Event[] = await res.json();

  // fetch all events yang ini 
  const allRes = await fetch(baseUrl, { cache: "no-store" });
  const allEvents: Event[] = allRes.ok ? await allRes.json() : [];
  const locations = Array.from(new Set(allEvents.map((e) => e.location))).sort();

  return (

    <main className="mx-auto mt-10 w-full max-w-6xl px-6 pb-16">
      <LocationFilter selected={location} locations={locations} />
    <h2 className="mb-4 text-lg font-semibold text-gray-700">
      Search results
      {search && <> for "<span className="font-semibold">{search}</span>"</>}
      {location && (
        <>
          {search ? " and" : " for"} location "
          <span className="font-semibold">{location}</span>"
        </>
      )}
    </h2>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">No events found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-gray-800">
          {events.map((event) => (
            <article
              key={event.event_id}
              className="rounded-lg bg-gray-50 p-3 shadow-sm"
            >
              <div className="mb-3 h-28 w-full rounded-md bg-gray-300" />
              <h3 className="text-sm font-semibold text-gray-700">
                {event.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(event.start_date).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{event.location}</p>
              <p className="mt-2 text-xs font-semibold">
                {event.is_paid
                  ? `Rp ${event.price.toLocaleString("id-ID")}` //inget harus ini supaya bisa jadi rupiah
                  : "Free"}
              </p>
              <div className="mt-3">
                <Link href={`browse/${event.event_id}`}>
                  <button className="bg-green-950 text-white w-full p-2 rounded-lg hover:bg-green-950/80 cursor-pointer">Event Detail</button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
