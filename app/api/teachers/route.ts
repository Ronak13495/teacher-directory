import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const data = await req.json();

  const { error } = await supabase.from("teacher").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subjects: data.subjects,
    can_travel: data.canTravel,
    user_id: data.userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}