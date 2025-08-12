import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET all tags
export async function GET() {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// POST new tag
export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from("tags").insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}