// src/app/(site)/browse/page.tsx

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);


type Event = {
  event_id: string;
  name: string;
  location: string;
  start_date: string;
  price: number;
  is_paid: boolean;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search ?? "";

  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events?${params.toString()}`,
    { cache: "no-store" }
  );

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

  return (
    <main className="mx-auto mt-10 w-full max-w-6xl px-6 pb-16">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        Search results
        {search && <> for "<span className="font-semibold">{search}</span>"</>}
      </h2>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">No events found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                  ? `Rp ${event.price.toLocaleString("id-ID")}`
                  : "Free"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
