'use client';
import { addToCart } from '@/lib/cart';
import { toast } from '@/components/Toast';

// Label depends on who is buying: schools build a quote, families a cart.
export default function AddButton({ game, role, small }) {
  const quote = role && role !== 'individual';
  const label = quote ? 'Add to quote' : 'Add to cart';
  return <button className={'btn' + (small ? ' sm' : '')} onClick={() => { addToCart(game); toast(quote ? 'Added to your quote' : 'Added to cart'); }}>{label}</button>;
}
