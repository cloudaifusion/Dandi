import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '../supabase-server';
import { getServerSessionHelper } from '../../../lib/auth';

// Helper function to get user ID from session
async function getUserIdFromSession() {
  const session = await getServerSessionHelper();
  if (!session?.user?.email) {
    return null;
  }

  // Get user ID from Supabase using email
  const { data: user, error } = await supabaseClient
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseClient
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, status = 'active', limit = 1000 } = body;
  
  if (!name) {
    return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
  }

  // Validate limit
  if (limit && (typeof limit !== 'number' || limit < 1)) {
    return NextResponse.json({ success: false, error: 'Limit must be a positive number' }, { status: 400 });
  }

  // Generate a random API key
  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk-';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const { data, error } = await supabaseClient
    .from('api_keys')
    .insert([{
      name,
      key: generateApiKey(),
      status,
      user_id: userId,
      usage: 0,
      limit: limit
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, data }, { status: 201 });
}