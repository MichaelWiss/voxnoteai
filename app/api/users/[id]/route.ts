import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
       

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;
    const body = await req.json();
    const { data, error } = await supabase
        .from('users')
        .update(body)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
}