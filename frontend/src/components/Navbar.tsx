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
          {isEO && (
            <button onClick={() => router.push("/events/create")} className="hover:text-blue-600">
              Create Events
            </button>
          )}
          <button onClick={() => router.push("/browse")} className="hover:text-blue-600">
            Browse Events
          </button>
          <button onClick={() => router.push("/tickets")} className="hover:text-blue-600">
            Tickets
          </button>

          {isAuthed ? (
            <div
    className="relative"
    onMouseEnter={() => setMenuOpen(true)}
    onMouseLeave={() => setMenuOpen(false)}
  >
    <button
      onClick={() => setMenuOpen((v) => !v)}
      className="flex items-center gap-2 rounded-md bg-gray-300 px-3 py-2 focus:outline-none"
    >
      <span className="h-6 w-6 rounded bg-white" />
      <span className="text-sm text-gray-800">{session.user?.name || session.user?.email}</span>
      <span className="text-gray-600">▾</span>
    </button>

    {menuOpen && (
      <div className="absolute right-0 top-full w-48 rounded-b-lg bg-gray-300 p-3 text-left text-sm text-gray-800 shadow-lg">
        <button onClick={() => router.push("/profile")} className="block w-full text-left py-1 hover:text-blue-600">Profile</button>
        <button onClick={() => router.push("/tickets")} className="block w-full text-left py-1 hover:text-blue-600">My Tickets</button>
        <button onClick={() => router.push("/account")} className="block w-full text-left py-1 hover:text-blue-600">Account Settings</button>
        <button onClick={() => signOut()} className="block w-full text-left py-1 hover:text-blue-600">Log out</button>
      </div>
    )}
  </div>
          ) : (
            <>
              <button onClick={() => router.push("/auth/login")} className="rounded-md border px-3 py-1 hover:text-blue-600">Login</button>
              <button onClick={() => router.push("/auth/register")} className="rounded-md border px-3 py-1 hover:text-blue-600">Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
