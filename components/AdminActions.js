'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';

export default function AdminActions({ kind, id, status }) {
  const router = useRouter();
  async function set(table, patch, msg) {
    const { error } = await createClient().from(table).update(patch).eq('id', id);
    if (error) return toast(error.message);
    toast(msg); router.refresh();
  }
  if (kind === 'app') return (
    <div style={{ display: 'flex', gap: 4 }}>
      {status === 'submitted' && <button className="btn ghost" onClick={() => set('applications', { status: 'scheduled' }, 'Scheduled')}>Schedule</button>}
      {status !== 'accepted' && status !== 'declined' && <button className="btn ghost" onClick={() => set('applications', { status: 'accepted' }, 'Accepted')}>Accept</button>}
      {status !== 'declined' && status !== 'accepted' && <button className="btn ghost" onClick={() => set('applications', { status: 'declined' }, 'Declined')}>Decline</button>}
    </div>
  );
  if (kind === 'order') {
    if (status === 'quote_sent' || status === 'approved' || status === 'po_received') return <button className="btn ghost" onClick={() => set('orders', { status: 'paid', paid_at: new Date().toISOString() }, 'Marked paid')}>Mark paid</button>;
    if (status === 'paid') return <button className="btn ghost" onClick={() => set('orders', { status: 'shipped' }, 'Marked shipped')}>Shipped</button>;
    if (status === 'shipped') return <button className="btn ghost" onClick={() => set('orders', { status: 'delivered' }, 'Marked delivered')}>Delivered</button>;
  }
  return null;
}
