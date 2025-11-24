// src/app/(site)/layout.tsx
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t bg-[#f2f0f0]">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-500">
          ©2025 Event Project
        </div>
      </footer>
    </div>
  );
}
