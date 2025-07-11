import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'apiKey is required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single();
    if (error || !data) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 });
  }
} 