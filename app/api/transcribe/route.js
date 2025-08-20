import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get("file");

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert File object to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: audioFile.type });

    // Send to OpenAI for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: blob,
      model: "whisper-1",
    });

    // Return the transcribed text
    return NextResponse.json({ 
      text: transcription.text,
      success: true 
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
