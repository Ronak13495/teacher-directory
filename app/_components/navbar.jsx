"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setLoggedIn(!!user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/directory", label: "Directory" },
    { href: "/join", label: "Join Us" },
    ...(loggedIn ? [{ href: "/dashboard", label: "My Profile" }] : []),
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(244,247,242,0.92)" : "rgba(244,247,242)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(90,120,80,0.15)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(90,120,80,0.08)" : "none",
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <span className="text-2xl" style={{ color: "#b85c3a" }}>𝄞</span>
          <span className="text-lg font-bold" style={{ color: "#1e2e1a" }}>MusicTeachers</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            const isJoin = label === "Join Us";

            if (isJoin) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="ml-3 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #b85c3a, #d4784e)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(184,92,58,0.25)",
                  }}
                >
                  {label}
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? "#b85c3a" : "#3d5535",
                  background: isActive ? "rgba(184,92,58,0.1)" : "transparent",
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}