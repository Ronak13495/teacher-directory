"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { INSTRUMENTS } from "@/lib/instruments";

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  can_travel: boolean;
  bio: string | null;
};

type Props = {
  teachers: Teacher[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
};

export default function DirectoryClient({
  teachers,
  totalPages,
  currentPage,
  totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [nameInput, setNameInput] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [travelFilter, setTravelFilter] = useState<"all" | "yes" | "no">("all");

  const applyFilters = (overrides?: Partial<{
    name: string;
    subjects: string[];
    travel: "all" | "yes" | "no";
  }>) => {
    const name = overrides?.name ?? nameInput;
    const subjects = overrides?.subjects ?? selectedSubjects;
    const travel = overrides?.travel ?? travelFilter;

    const params = new URLSearchParams();
    params.set("page", "1"); // reset to page 1 on filter change
    if (name) params.set("name", name);
    if (travel !== "all") params.set("travel", travel);
    if (subjects.length > 0) params.set("subjects", subjects.join(","));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const toggleSubject = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];
    setSelectedSubjects(updated);
    applyFilters({ subjects: updated });
  };

  const clearFilters = () => {
    setNameInput("");
    setSelectedSubjects([]);
    setTravelFilter("all");
    startTransition(() => router.push(pathname));
  };

  const hasActiveFilters = nameInput || selectedSubjects.length > 0 || travelFilter !== "all";

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (nameInput) params.set("name", nameInput);
    if (travelFilter !== "all") params.set("travel", travelFilter);
    if (selectedSubjects.length > 0) params.set("subjects", selectedSubjects.join(","));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>

      {/* Filter Panel */}
      <div
        className="rounded-2xl p-6 mb-8 space-y-5"
        style={{
          background: "rgba(240,245,238,0.85)",
          border: "1px solid rgba(90,120,80,0.15)",
          boxShadow: "0 2px 16px rgba(90,120,80,0.07)",
        }}
      >
        {/* Name search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "#fff",
              border: "1px solid rgba(90,120,80,0.2)",
              color: "#1e2e1a",
            }}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        {/* Instruments */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#5a7a50" }}>
            Filter by instrument
          </p>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENTS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className="px-3 py-1.5 cursor-pointer rounded-full text-sm transition-all duration-150"
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

        {/* Travel + clear */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#5a7a50" }}>
              Can travel
            </p>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(90,120,80,0.2)" }}>
              {(["all", "yes", "no"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => { setTravelFilter(val); applyFilters({ travel: val }); }}
                  className="px-4 cursor-pointer py-1.5 text-sm font-medium transition-all duration-150 capitalize"
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
              onClick={clearFilters}
              className="text-xs px-3 py-1.5 cursor-pointer rounded-full transition-all duration-150"
              style={{ color: "#b85c3a", border: "1px solid rgba(184,92,58,0.3)", background: "rgba(184,92,58,0.05)" }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: "#7a9a70" }}>
        {totalCount} teacher{totalCount !== 1 ? "s" : ""} found
        {totalPages > 1 && ` — page ${currentPage} of ${totalPages}`}
      </p>

      {/* Teacher Cards */}
      {teachers.length === 0 ? (
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
          {teachers.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl transition-all duration-200"
              style={{
                background: "rgba(240,245,238,0.85)",
                border: "1px solid rgba(90,120,80,0.12)",
                boxShadow: "0 2px 12px rgba(90,120,80,0.06)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
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

              {t.bio && (
                <p className="text-sm mb-4 line-clamp-2" style={{ color: "#5a7a50" }}>{t.bio}</p>
              )}

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

              <div className="space-y-1 pt-3 mb-4" style={{ borderTop: "1px solid rgba(90,120,80,0.1)" }}>
                <p className="text-sm flex items-center gap-2" style={{ color: "#5a7a50" }}>
                  <span>✉️</span> {t.email}
                </p>
                <p className="text-sm flex items-center gap-2" style={{ color: "#5a7a50" }}>
                  <span>📞</span> {t.phone}
                </p>
              </div>

              <Link
                href={`/teachers/${t.id}`}
                className="flex items-center justify-center gap-1 w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(184,92,58,0.08)",
                  color: "#b85c3a",
                  border: "1px solid rgba(184,92,58,0.2)",
                }}
              >
                View Profile →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {/* Prev */}
          {currentPage > 1 ? (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.8)",
                color: "#3d5535",
                border: "1px solid rgba(90,120,80,0.25)",
              }}
            >
              ← Prev
            </Link>
          ) : (
            <span
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ color: "rgba(90,120,80,0.3)", border: "1px solid rgba(90,120,80,0.1)" }}
            >
              ← Prev
            </span>
          )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: "#7a9a70" }}>...</span>
              ) : (
                <Link
                  key={p}
                  href={buildPageUrl(p as number)}
                  className="w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-150"
                  style={{
                    background: currentPage === p ? "linear-gradient(135deg, #4a7040, #6a9a60)" : "rgba(255,255,255,0.8)",
                    color: currentPage === p ? "#fff" : "#3d5535",
                    border: currentPage === p ? "1px solid transparent" : "1px solid rgba(90,120,80,0.25)",
                    boxShadow: currentPage === p ? "0 2px 8px rgba(74,112,64,0.3)" : "none",
                  }}
                >
                  {p}
                </Link>
              )
            )}

          {/* Next */}
          {currentPage < totalPages ? (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.8)",
                color: "#3d5535",
                border: "1px solid rgba(90,120,80,0.25)",
              }}
            >
              Next →
            </Link>
          ) : (
            <span
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ color: "rgba(90,120,80,0.3)", border: "1px solid rgba(90,120,80,0.1)" }}
            >
              Next →
            </span>
          )}
        </div>
      )}
    </div>
  );
}