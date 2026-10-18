'use client';
import { createClient } from '@/lib/supabase/client';

// The database trigger creates the org, profile, and publisher record from this metadata.
export async function signUp({ email, password, fullName, role, orgName, website }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role, org_name: orgName, website } } });
  if (error) return { error: error.message };
  if (!data.session) return { user: data.user, needsConfirm: true };
  return { user: data.user };
}

export async function signIn({ email, password }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
  return { role: profile?.role || 'individual' };
}
