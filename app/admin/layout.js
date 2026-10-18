import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';

export default async function AdminLayout({ children }) {
  const { profile } = await getSession();
  if (!profile) redirect('/signin?next=/admin');
  if (profile.role !== 'admin') redirect('/');
  return children;
}
