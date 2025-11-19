"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    // right now backend only searches by name, so we won't use location in the query
    // but we can keep the input for UI/ future use

    router.push(`/browse?${params.toString()}`);
  };

  return (
    <header className="w-full border-b bg-[#f2f0f0]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        {/* logo placeholder */}
        <div className="h-10 w-24 bg-gray-300" />

        {/* search + location */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 max-w-xl items-center gap-2 text-gray-700"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Search event"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-40 rounded-md border px-3 py-2 text-sm"
            placeholder="Location"
          />
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm"
          >
            search
          </button>
        </form>

        {/* right side buttons */}
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <button>Create Events</button>
          <button>Login</button>
          <button className="rounded-md border px-3 py-1">Sign up</button>
        </div>
      </div>
    </header>
  );
}
