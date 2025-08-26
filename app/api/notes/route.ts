import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all notes (with tags) for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
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
      .eq("user_id", session.user.id) // Only return user's own notes
      .order('created_at', { ascending: false });
      
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    
    // Transform the data to flatten tags
    const notesWithTags = data?.map(note => ({
      ...note,
      tags: note.note_tags?.map((nt: { tags: { name: string } | null }) => nt.tags?.name).filter(Boolean) || []
    })) || [];
    
    return NextResponse.json(notesWithTags);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST new note
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tags, ...noteData } = body;
    
    // Validate required fields
    if (!noteData.user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }
    
    if (!noteData.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    
    // Insert the note first
    const { data: noteResult, error: noteError } = await supabaseAdmin
      .from("notes")
      .insert(noteData)
      .select()
      .single();
    
  if (noteError) return NextResponse.json({ error: noteError.message }, { status: 400 });
  
  // Handle tags if provided
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      // First, try to find or create the tag
      const { data: existingTag, error: tagSelectError } = await supabaseAdmin
        .from("tags")
        .select("id")
        .eq("name", tagName)
        .eq("user_id", noteResult.user_id)
        .single();
        
      if (tagSelectError && tagSelectError.code !== 'PGRST116') {
        console.error('Error finding tag:', tagSelectError);
        continue;
      }
      
      let tagId;
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Create new tag
        const { data: newTag, error: tagInsertError } = await supabaseAdmin
          .from("tags")
          .insert({ name: tagName, user_id: noteResult.user_id })
          .select("id")
          .single();
          
        if (tagInsertError) {
          console.error('Error creating tag:', tagInsertError);
          continue;
        }
        tagId = newTag.id;
      }
      
      // Link tag to note
      const { error: linkError } = await supabaseAdmin
        .from("note_tags")
        .insert({ note_id: noteResult.id, tag_id: tagId });
        
      if (linkError) {
        console.error('Error linking tag to note:', linkError);
      }
    }
  }
  
  // Return the note with tags
  const { data: finalNote, error: finalError } = await supabaseAdmin
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
    .eq("id", noteResult.id)
    .single();
    
  if (finalError) return NextResponse.json({ error: finalError.message }, { status: 400 });
  
  // Transform the data
  const noteWithTags = {
    ...finalNote,
    tags: finalNote.note_tags?.map((nt: { tags: { name: string } | null }) => nt.tags?.name).filter(Boolean) || []
  };
  
  return NextResponse.json(noteWithTags);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
