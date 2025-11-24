"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search) params.set("search", search);

    router.push(`/browse?${params.toString()}`);
  };

  return (
    <header className="w-full border-b bg-[#f2f0f0]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        {/* logo */}
        <div onClick={() => router.push("/")} className="h-10 w-24 bg-gray-300" />

        {/* search */}
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
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm hover:text-cyan-600"
          >
            search
          </button>
        </form>

        {/* right side buttons */}
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <button onClick={() => router.push("/browse")} className="hover:text-cyan-600">Browse Events</button>
          <button className="hover:text-cyan-600">Create Events</button>
          <button onClick={() => router.push("/auth/login")} className="rounded-md border px-3 py-1 hover:text-cyan-600">Login</button>
          <button onClick={() => router.push("/auth/register")} className="rounded-md border px-3 py-1 hover:text-cyan-600">Sign up</button>
        </div>
      </div>
    </header>
  );
}
