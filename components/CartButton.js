'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart, decrement } from '@/lib/cart';
import { money } from '@/lib/roles';

export default function CartButton() {
  const { cart, count, subtotal } = useCart();
  const [open, setOpen] = useState(false);
  if (count === 0) return null;
  return (
    <>
      <button className="cartbtn" onClick={() => setOpen(true)}>Cart <span className="c">{count}</span></button>
      <div className={'drawer' + (open ? ' on' : '')} onClick={() => setOpen(false)}>
        <div className="pane" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>Your cart</h2><button className="x" onClick={() => setOpen(false)} aria-label="Close">×</button></div>
          <div>
            {cart.map(l => (
              <div className="line" key={l.id}>
                <span><b>{l.title}</b><br /><span className="note">{l.qty} × {money(l.msrp)}</span></span>
                <span><button className="x" onClick={() => decrement(l.id)} aria-label="Remove one">−</button> {money(l.qty * l.msrp)}</span>
              </div>
            ))}
          </div>
          <div className="line" style={{ border: 0 }}><b>Subtotal</b><b>{money(subtotal)}</b></div>
          <p className="note">Schools and districts: checkout becomes a PO-ready quote. Families: card checkout.</p>
          <Link href="/checkout" className="btn" onClick={() => setOpen(false)}>Check out</Link>
          <button className="btn ghost" onClick={() => setOpen(false)}>Keep shopping</button>
        </div>
      </div>
    </>
  );
}
