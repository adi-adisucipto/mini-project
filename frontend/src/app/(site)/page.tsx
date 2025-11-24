// src/app/page.tsx
// jangan lupa buat sitemapping like this src/app/(site)/page.tsx src/app/(site)/layout.tsx biar isa bedain yang mana ada navbar and yang gada

export default function HomePage() {
  return (
    <main className=" bg-white">
      {/* hero banner */}
      <section className="mx-auto mt-6 w-full max-w-6xl px-6">
        <div className="h-80 w-full rounded-xl bg-gray-300" />
      </section>

      {/* categories */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3"
            >
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-xs text-gray-500">20 events</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* discount events */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">
          Discount promotion / Top Events
        </h2>
        <div className="h-40 w-full rounded-lg bg-gray-300" />
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
