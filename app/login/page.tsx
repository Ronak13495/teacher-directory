"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(90,120,80,0.25)",
    background: "rgba(255,255,255,0.8)",
    color: "#1e2e1a",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#5a7a50",
    marginBottom: "6px",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "#f4f7f2", fontFamily: "Georgia, serif" }}
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              border: "1px solid rgba(90,120,80,0.3)",
              background: "rgba(90,120,80,0.08)",
              color: "#4a7040",
            }}
          >
            🎵 Welcome back
          </div>
          <h1 className="text-4xl font-black mb-2" style={{ color: "#1e2e1a" }}>
            Teacher Login
          </h1>
          <p style={{ color: "#7a9a70" }}>
            Sign in to manage your profile
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(240,245,238,0.9)",
            border: "1px solid rgba(90,120,80,0.15)",
            boxShadow: "0 4px 32px rgba(90,120,80,0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={inputStyle}
                placeholder="jane@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle}
                placeholder="Your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(184,92,58,0.08)",
                  border: "1px solid rgba(184,92,58,0.25)",
                  color: "#b85c3a",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200"
              style={{
                background: loading
                  ? "rgba(90,120,80,0.4)"
                  : "linear-gradient(135deg, #b85c3a, #d4784e)",
                color: "#fff",
                boxShadow: loading ? "none" : "0 8px 24px rgba(184,92,58,0.3)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>

            <p className="text-sm text-center" style={{ color: "#7a9a70" }}>
              Don't have an account?{" "}
              <a href="/join" style={{ color: "#b85c3a", textDecoration: "underline" }}>
                Join here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}