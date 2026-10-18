'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';

export default function ConSignup({ conventionId, publisherId, hasSlots }) {
  const router = useRouter();
  async function go(kind) {
    const { error } = await createClient().from('con_signups').insert({ convention_id: conventionId, publisher_id: publisherId, kind });
    if (error) return toast(error.message);
    toast(kind === 'demo_slot' ? 'Demo slot requested' : 'Consignment requested'); router.refresh();
  }
  return <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {hasSlots && <button className="btn" onClick={() => go('demo_slot')}>Request slot</button>}
    <button className="btn ghost" onClick={() => go('consignment')}>Send stock</button>
  </div>;
}
