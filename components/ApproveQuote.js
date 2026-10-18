'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';

export default function ApproveQuote({ id }) {
  const [po, setPo] = useState(''); const [busy, setBusy] = useState(false); const router = useRouter();
  async function go() {
    setBusy(true);
    const { error } = await createClient().from('orders').update({ status: po ? 'po_received' : 'approved', po_number: po || null }).eq('id', id);
    setBusy(false);
    if (error) return toast(error.message);
    toast(po ? 'PO recorded' : 'Quote approved'); router.refresh();
  }
  return <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input value={po} onChange={e => setPo(e.target.value)} placeholder="PO #" style={{ width: 90, padding: '6px 8px' }} aria-label="PO number" /><button className="btn ghost" onClick={go} disabled={busy}>Approve</button></div>;
}
