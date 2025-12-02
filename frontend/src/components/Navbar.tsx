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
  const isUser = isAuthed && role === "USER";

  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const avatar = session?.user?.avatar;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/browse?${params.toString()}`);
  };

  const navLinks = [
    ...(isEO
      ? [
          { label: "Create Events", href: "/events/create" },
          { label: "Transactions", href: "/eo/transactions" },
          { label: "Events Manager", href: "/eo/events" },
        ]
      : [
          { label: "Browse Events", href: "/browse" },
          { label: "Tickets", href: "/tickets" },
        ]),
  ];

  const navigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <header className="w-full border-b bg-gray-200">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <div
          onClick={() => navigate("/")}
          className="h-10 w-24  cursor-pointer">

            <img
      src="/events-logo.png"
      alt="Events logo"
      className="h-10 w-24 object-cover rounded-xl"
    />
        </div>

        <form
          onSubmit={submitSearch}
          className="flex flex-1 items-center gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm bg-gray-100 text-gray-700"
            placeholder="Search event"
          />
          <button
            type="submit"
            className="rounded-md bg-[#F6A273] px-4 py-2 text-gray-700"
          >
            Search
          </button>
        </form>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-sm text-gray-700 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className="hover:text-[#F6A273] cursor-pointer"
            >
              {link.label}
            </button>
          ))}

          {isAuthed ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md bg-gray-300 px-3 py-2 focus:outline-none"
              >
                {avatar ? (
                  <img src={avatar} className="h-6 w-6 rounded" />
                ) : (
                  <span className="h-6 w-6 rounded bg-white" />
                )}
                <span className="text-sm text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </span>
                <span className="text-gray-600">▾</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full w-48 rounded-b-lg bg-gray-300 p-3 text-left text-sm text-gray-700 shadow-lg">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left py-1 hover:text-[#F6A273] cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/account")}
                    className="block w-full text-left py-1 hover:text-[#F6A273] cursor-pointer"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left py-1 hover:text-[#F6A273] cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth/login")}
                className="rounded-md border px-3 py-1 hover:text-[#F6A273] cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="rounded-md border px-3 py-1 hover:text-[#F6A273] cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/*in hamburgernya*/}
        <button
          className="ml-auto rounded p-2 hover:bg-gray-300 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-gray-800 mb-1" />
          <span className="block h-0.5 w-6 bg-gray-800 mb-1" />
          <span className="block h-0.5 w-6 bg-gray-800" />
        </button>
      </div>

      {/*dropdown mobile*/}
      {mobileOpen && (
        <div className="md:hidden border-t bg-gray-100 px-4 py-3 space-y-2 text-sm text-gray-700">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
            >
              {link.label}
            </button>
          ))}

          {isAuthed ? (
            <>
              <button
                onClick={() => { navigate("/profile"); }}
                className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => { navigate("/account"); }}
                className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
              >
                Account Settings
              </button>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth/login")}
                className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="block w-full text-left py-2 hover:text-[#F6A273] cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
