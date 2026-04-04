"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "#retreat", label: "Retreat" },
  { href: "#accommodation", label: "Accommodation" },
  { href: "#booking", label: "Booking" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-4 py-4 sm:px-6">
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative z-[60] flex h-12 w-12 flex-col items-center justify-center gap-1.5 border border-black bg-white text-black"
        >
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#FFD1D1] transition-opacity duration-300 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-10 px-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-anton)] text-4xl uppercase tracking-wide text-white sm:text-5xl"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
