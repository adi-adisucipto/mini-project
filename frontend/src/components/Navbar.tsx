"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const isAuthed = status === "authenticated";
  const isEO = isAuthed && (role === "ORGANIZER" || role === "ADMIN");

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const avatar = session?.user?.avatar

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <header className="w-full border-b bg-gray-200">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <div onClick={() => router.push("/")} className="h-10 w-24 bg-gray-400 cursor-pointer" />

        <form onSubmit={submitSearch} className="flex flex-1 max-w-2xl items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm bg-gray-100 text-gray-700"
            placeholder="Search event"
          />
          <button type="submit" className="rounded-md bg-gray-500 px-4 py-2 text-white">Search</button>
        </form>

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
