import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "./directory-client";

const PAGE_SIZE = 12;

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; name?: string; travel?: string; subjects?: string }>;
}) {
  const { page, name, travel, subjects } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1"));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("teacher")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to);

  // Server-side filters
  if (name) query = query.ilike("name", `%${name}%`);
  if (travel === "yes") query = query.eq("can_travel", true);
  if (travel === "no") query = query.eq("can_travel", false);
  if (subjects) {
    const subjectArray = subjects.split(",");
    query = query.contains("subjects", subjectArray);
  }

  const { data: teachers, count } = await query;

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "#f4f7f2", fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: "#1e2e1a" }}>
            Find a Teacher
          </h1>
          <p style={{ color: "#7a9a70" }}>
            Browse our community of music educators
          </p>
        </div>

        <DirectoryClient
          teachers={teachers || []}
          totalPages={totalPages}
          currentPage={currentPage}
          totalCount={count || 0}
        />
      </div>
    </div>
  );
}