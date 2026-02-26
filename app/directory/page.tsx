import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "./directory-client";

export default async function DirectoryPage() {
  const supabase = await createClient();
  const { data: teachers } = await supabase.from("teacher").select("*");

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Teachers Directory</h1>
      <DirectoryClient teachers={teachers || []} />
    </div>
  );
}
