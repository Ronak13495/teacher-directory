"use client";

import { useState, useMemo } from "react";

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  can_travel: boolean;
};

export default function DirectoryClient({ teachers }: { teachers: Teacher[] }) {
  const [nameFilter, setNameFilter] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [travelFilter, setTravelFilter] = useState<"all" | "yes" | "no">("all");

  const allSubjects = Array.from(new Set(teachers.flatMap((t) => t.subjects))).sort();

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesName = nameFilter === "" || t.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.every((s) => t.subjects.includes(s));
      const matchesTravel =
        travelFilter === "all" ||
        (travelFilter === "yes" && t.can_travel) ||
        (travelFilter === "no" && !t.can_travel);
      return matchesName && matchesSubjects && matchesTravel;
    });
  }, [teachers, nameFilter, selectedSubjects, travelFilter]);

  const hasActiveFilters = nameFilter || selectedSubjects.length > 0 || travelFilter !== "all";

  return (
    <div style={{ fontFamily: "Georgia, serif" }}>

      {/* Filter Panel */}
      <div
        className="rounded-2xl p-6 mb-8 space-y-5"
        style={{
          background: "rgba(240,245,238,0.85)",
          border: "1px solid rgba(90,120,80,0.15)",
          boxShadow: "0 2px 16px rgba(90,120,80,0.07)",
        }}
      >
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: "#7a9a70" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: "#fff",
              border: "1px solid rgba(90,120,80,0.2)",
              color: "#1e2e1a",
            }}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {/* Instrument filter */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#5a7a50" }}>
            Filter by instrument
          </p>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all duration-150"
                  style={{
                    background: isSelected ? "linear-gradient(135deg, #b85c3a, #d4784e)" : "rgba(255,255,255,0.8)",
                    color: isSelected ? "#fff" : "#3d5535",
                    border: isSelected ? "1px solid transparent" : "1px solid rgba(90,120,80,0.25)",
                    boxShadow: isSelected ? "0 2px 8px rgba(184,92,58,0.25)" : "none",
                  }}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel filter + clear */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#5a7a50" }}>
              Can travel
            </p>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(90,120,80,0.2)" }}>
              {(["all", "yes", "no"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setTravelFilter(val)}
                  className="px-4 py-1.5 text-sm font-medium transition-all duration-150 capitalize"
                  style={{
                    background: travelFilter === val ? "linear-gradient(135deg, #4a7040, #6a9a60)" : "#fff",
                    color: travelFilter === val ? "#fff" : "#3d5535",
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { setNameFilter(""); setSelectedSubjects([]); setTravelFilter("all"); }}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
              style={{ color: "#b85c3a", border: "1px solid rgba(184,92,58,0.3)", background: "rgba(184,92,58,0.05)" }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: "#7a9a70" }}>
        {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? "s" : ""} found
      </p>

      {/* Teacher Cards */}
      {filteredTeachers.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ background: "rgba(240,245,238,0.6)", border: "1px solid rgba(90,120,80,0.1)" }}
        >
          <p className="text-4xl mb-3">🎵</p>
          <p className="font-semibold mb-1" style={{ color: "#1e2e1a" }}>No teachers found</p>
          <p className="text-sm" style={{ color: "#7a9a70" }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl transition-all duration-200 group"
              style={{
                background: "rgba(240,245,238,0.85)",
                border: "1px solid rgba(90,120,80,0.12)",
                boxShadow: "0 2px 12px rgba(90,120,80,0.06)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4a7040, #6a9a60)", color: "#fff" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight" style={{ color: "#1e2e1a" }}>{t.name}</h2>
                    {t.can_travel && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(90,120,80,0.12)", color: "#4a7040" }}
                      >
                        📍 Can travel
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Instruments */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(184,92,58,0.1)", color: "#b85c3a", border: "1px solid rgba(184,92,58,0.2)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-1 pt-3" style={{ borderTop: "1px solid rgba(90,120,80,0.1)" }}>
                <p className="text-sm flex items-center gap-2" style={{ color: "#5a7a50" }}>
                  <span>✉️</span> {t.email}
                </p>
                <p className="text-sm flex items-center gap-2" style={{ color: "#5a7a50" }}>
                  <span>📞</span> {t.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}