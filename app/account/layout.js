import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';
import { homeFor } from '@/lib/roles';

export default async function AccountLayout({ children }) {
  const { profile } = await getSession();
  if (!profile) redirect('/signin?next=/account');
  if (profile.role === 'publisher') redirect('/publisher');
  if (profile.role === 'admin') redirect('/admin');
  return children;
}
