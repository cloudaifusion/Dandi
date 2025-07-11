import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';

export async function GET() {
  const { data, error } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, status = 'active' } = body;
  if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

  // Generate a random API key
  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk-';
    for (let i = 0; i < 32; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const { data, error } = await supabase.from('api_keys').insert([
    { name, key: generateApiKey(), status }
  ]).select().single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, status } = body;
  if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

  const { data, error } = await supabase.from('api_keys').update({ name, status }).eq('id', id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

  const { data, error } = await supabase.from('api_keys').delete().eq('id', id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}