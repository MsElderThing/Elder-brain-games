'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, clearCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import { money, homeFor } from '@/lib/roles';
import { toast } from '@/components/Toast';

export default function CheckoutForm({ profile }) {
  const { cart, subtotal } = useCart();
  const router = useRouter();
  const [notes, setNotes] = useState(''); const [po, setPo] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const isCard = profile.role === 'individual';
  const tax = profile.orgs?.tax_exempt || !isCard ? 0 : Math.round(subtotal * 0.06 * 100) / 100;

  async function submit(e) {
    e.preventDefault(); if (!cart.length) return; setBusy(true); setErr('');
    const supabase = createClient();
    const valid = new Date(); valid.setDate(valid.getDate() + 60);
    const { data: order, error } = await supabase.from('orders').insert({
      org_id: profile.org_id, created_by: profile.id, kind: isCard ? 'card' : 'quote',
      status: isCard ? 'paid' : 'quote_sent', po_number: po || null, subtotal, tax, total: subtotal + tax,
      quote_valid_until: isCard ? null : valid.toISOString().slice(0, 10), notes,
      paid_at: isCard ? new Date().toISOString() : null,
    }).select().single();
    if (error) { setBusy(false); return setErr(error.message); }
    const lines = cart.map(l => ({ order_id: order.id, game_id: l.id, qty: l.qty, unit_price: l.msrp }));
    const { error: le } = await supabase.from('order_lines').insert(lines);
    setBusy(false);
    if (le) return setErr(le.message);
    clearCart();
    toast(isCard ? `Order ${order.number} placed` : `Quote Q-${order.number} created with W-9 attached`);
    router.push(homeFor(profile.role)); router.refresh();
  }

  if (!cart.length) return <div className="panel"><p className="note">Your cart is empty.</p><Link href="/catalog" className="btn" style={{ marginTop: 12 }}>Browse the catalog</Link></div>;
  return (
    <div className="grid2">
      <div className="panel"><header><h2>Items</h2></header>
        {cart.map(l => <div className="line" key={l.id}><span><b>{l.title}</b><br /><span className="note">{l.qty} × {money(l.msrp)}</span></span><span>{money(l.qty * l.msrp)}</span></div>)}
        <div className="line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        {isCard && <div className="line"><span>Michigan sales tax (6%)</span><span>{money(tax)}</span></div>}
        <div className="line" style={{ border: 0 }}><b>Total</b><b>{money(subtotal + tax)}</b></div>
      </div>
      <form className="panel" onSubmit={submit}>
        <header><h2>{isCard ? 'Payment' : 'Quote details'}</h2></header>
        {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
        {isCard ? (
          <p className="note">Card payments go live when Square is connected. For now this records the order so you can see how the flow works.</p>
        ) : (
          <>
            <p className="note">Your quote is good for 60 days and includes our W-9. Forward it to your business office; they can approve it from the district dashboard.</p>
            <div className="field" style={{ marginTop: 12 }}><label htmlFor="po">PO number (if you already have one)</label><input id="po" value={po} onChange={e => setPo(e.target.value)} /></div>
          </>
        )}
        <div className="field" style={{ marginTop: 12 }}><label htmlFor="notes">Notes (ship-to, building, grade)</label><textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 14 }}>{busy ? 'Working' : isCard ? 'Place order' : 'Create quote'}</button>
      </form>
    </div>
  );
}
