import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  can_travel: boolean;
  bio: string | null;
};

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: teacher } = await supabase
    .from("teacher")
    .select("*")
    .eq("id", (await params).id)
    .single<Teacher>();

  if (!teacher) notFound();

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "#f4f7f2", fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-150"
          style={{ color: "#5a7a50" }}
        >
          ← Back to Directory
        </Link>

        {/* Profile card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(240,245,238,0.9)",
            border: "1px solid rgba(90,120,80,0.15)",
            boxShadow: "0 4px 32px rgba(90,120,80,0.1)",
          }}
        >
          {/* Header band */}
          <div
            className="px-8 py-8 flex items-center gap-6"
            style={{
              background: "linear-gradient(135deg, #2a3e24, #3a5530)",
              borderBottom: "1px solid rgba(90,120,80,0.2)",
            }}
          >
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #b85c3a, #d4784e)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(184,92,58,0.4)",
              }}
            >
              {teacher.name.charAt(0)}
            </div>

            <div>
              <h1
                className="text-2xl md:text-3xl font-black mb-1"
                style={{ color: "#f0f5ee" }}
              >
                {teacher.name}
              </h1>
              {teacher.can_travel && (
                <span
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(90,120,80,0.3)",
                    color: "#b8d4a8",
                    border: "1px solid rgba(90,120,80,0.4)",
                  }}
                >
                  📍 Available to travel
                </span>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* Bio */}
            {teacher.bio && (
              <div>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#5a7a50" }}
                >
                  About
                </h2>
                <p
                  className="leading-relaxed text-base"
                  style={{ color: "#2e4428" }}
                >
                  {teacher.bio}
                </p>
              </div>
            )}

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* Instruments */}
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#5a7a50" }}
              >
                Instruments
              </h2>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: "rgba(184,92,58,0.1)",
                      color: "#b85c3a",
                      border: "1px solid rgba(184,92,58,0.2)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* Contact */}
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#5a7a50" }}
              >
                Contact
              </h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center gap-3 text-sm transition-colors duration-150 group"
                  style={{ color: "#2e4428" }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "rgba(90,120,80,0.12)" }}
                  >
                    ✉️
                  </span>
                  <span style={{ color: "#b85c3a", textDecoration: "underline" }}>
                    {teacher.email}
                  </span>
                </a>
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "#2e4428" }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "rgba(90,120,80,0.12)" }}
                  >
                    📞
                  </span>
                  {teacher.phone}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(90,120,80,0.12)" }} />

            {/* CTA */}
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #b85c3a, #d4784e)",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(184,92,58,0.3)",
              }}
            >
              Contact {teacher.name.split(" ")[0]} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}