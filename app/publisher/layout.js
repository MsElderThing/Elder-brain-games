import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';
import { homeFor } from '@/lib/roles';

export default async function PublisherLayout({ children }) {
  const { profile } = await getSession();
  if (!profile) redirect('/signin?next=/publisher');
  if (profile.role !== 'publisher' && profile.role !== 'admin') redirect(homeFor(profile.role));
  return children;
}
