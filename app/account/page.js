import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';
import { homeFor } from '@/lib/roles';
export default async function Account() { const { profile } = await getSession(); redirect(homeFor(profile?.role)); }
