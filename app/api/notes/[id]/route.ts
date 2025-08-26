import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    
    const supabase = await createClient();
    const { data, error } = await supabase
    .from("notes")
    .select("*, note_tags(tag_id, tags(name))")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const body = await req.json();
    const { data, error } = await supabase
    .from("notes")
    .update(body)
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
