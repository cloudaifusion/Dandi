import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseClient } from '../../supabase-server';

// Helper function to get user ID from session
async function getUserIdFromSession() {
  const session = await getServerSession();
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

// Helper function to verify API key ownership
async function verifyApiKeyOwnership(apiKeyId: string, userId: string) {
  const { data, error } = await supabaseClient
    .from('api_keys')
    .select('id')
    .eq('id', apiKeyId)
    .eq('user_id', userId)
    .single();

  return !error && data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  // Verify ownership
  const isOwner = await verifyApiKeyOwnership(id, userId);
  if (!isOwner) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await supabaseClient
    .from('api_keys')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  // Verify ownership
  const isOwner = await verifyApiKeyOwnership(id, userId);
  if (!isOwner) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  const { name, status, limit } = body;

  // Validate limit if provided
  if (limit !== undefined && (typeof limit !== 'number' || limit < 1)) {
    return NextResponse.json({ success: false, error: 'Limit must be a positive number' }, { status: 400 });
  }

  const { data, error } = await supabaseClient
    .from('api_keys')
    .update({ name, status, limit })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  // Verify ownership
  const isOwner = await verifyApiKeyOwnership(id, userId);
  if (!isOwner) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await supabaseClient
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
} 