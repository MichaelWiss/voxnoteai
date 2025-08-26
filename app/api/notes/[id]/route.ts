import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    
    const { data, error } = await supabaseAdmin
      .from("notes")
      .select(`
        *,
        note_tags(
          tags(
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .eq("user_id", session.user.id) // Ensure user can only access their own notes
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Transform the data to flatten tags
    const noteWithTags = {
      ...data,
      tags: data.note_tags?.map((nt: { tags: { name: string } | null }) => nt.tags?.name).filter(Boolean) || []
    };
    
    return NextResponse.json(noteWithTags);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Remove user_id from body to prevent unauthorized changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...updateData } = body;
    
    const { data, error } = await supabaseAdmin
      .from("notes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", session.user.id) // Ensure user can only update their own notes
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    
    const { error } = await supabaseAdmin
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id); // Ensure user can only delete their own notes
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
