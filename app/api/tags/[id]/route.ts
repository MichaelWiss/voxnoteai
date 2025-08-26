import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("tags")
    .update(body)
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("tags").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}