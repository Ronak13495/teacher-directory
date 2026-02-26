"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InstrumentPicker from "@/app/_components/InstrumentPicker";

export default function JoinPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [] as string[],
    password: "",
    confirmPassword: "",
    canTravel: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Signup failed");

      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subjects: form.subjects,
          canTravel: form.canTravel,
          userId: authData.user.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      className="min-h-screen py-16 px-4"
      style={{ background: "#f4f7f2", fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              border: "1px solid rgba(90,120,80,0.3)",
              background: "rgba(90,120,80,0.08)",
              color: "#4a7040",
            }}
          >
            🎼 Join our community
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: "#1e2e1a" }}
          >
            Become a Teacher
          </h1>
          <p style={{ color: "#5a7a50" }}>
            Share your passion for music and connect with students in your area.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "rgba(240,245,238,0.9)",
            border: "1px solid rgba(90,120,80,0.15)",
            boxShadow: "0 4px 32px rgba(90,120,80,0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal info */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1e2e1a" }}>
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    style={inputStyle}
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    style={inputStyle}
                    placeholder="04XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  placeholder="jane@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* Instruments */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1e2e1a" }}>
                What do you teach?
              </h2>
              <InstrumentPicker
                selected={form.subjects}
                onChange={(updated) => setForm({ ...form, subjects: updated })}
              />
            </div>

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* Travel toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: "#1e2e1a" }}>Can travel to student</p>
                <p className="text-sm" style={{ color: "#7a9a70" }}>
                  Are you willing to travel to your student's location?
                </p>
              </div>
              <label className="flex items-center cursor-pointer select-none ml-4">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.canTravel}
                  onChange={(e) => setForm({ ...form, canTravel: e.target.checked })}
                />
                <div
                  className="relative w-12 h-6 rounded-full transition-colors duration-200"
                  style={{ background: form.canTravel ? "#6a9a60" : "rgba(90,120,80,0.2)" }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: form.canTravel ? "translateX(24px)" : "translateX(0)" }}
                  />
                </div>
              </label>
            </div>

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* Password */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1e2e1a" }}>
                Set a Password
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Password</label>
                  <input
                    style={inputStyle}
                    placeholder="Min. 6 characters"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    style={inputStyle}
                    placeholder="Repeat password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error */}
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

            {/* Submit */}
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
              {loading ? "Creating your profile..." : "Join as a Teacher →"}
            </button>

            <p className="text-sm text-center" style={{ color: "#7a9a70" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#b85c3a", textDecoration: "underline" }}>
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}