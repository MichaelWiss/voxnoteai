import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET all users
export async function GET() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// POST new user (manual insert — usually handled by Supabase Auth trigger)
export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from("users").insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}
