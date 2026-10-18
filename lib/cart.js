'use client';
import { useEffect, useState } from 'react';

const KEY = 'ebg_cart';
function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function write(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} window.dispatchEvent(new Event('ebg-cart')); }

export function addToCart(game) {
  const c = read(); const l = c.find(x => x.id === game.id);
  if (l) l.qty++; else c.push({ id: game.id, title: game.title, msrp: Number(game.msrp), cover: game.cover_color, qty: 1 });
  write(c);
}
export function decrement(id) { let c = read(); const l = c.find(x => x.id === id); if (!l) return; l.qty--; if (l.qty <= 0) c = c.filter(x => x.id !== id); write(c); }
export function clearCart() { write([]); }

export function useCart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const sync = () => setCart(read());
    sync(); window.addEventListener('ebg-cart', sync); return () => window.removeEventListener('ebg-cart', sync);
  }, []);
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const subtotal = cart.reduce((a, c) => a + c.qty * c.msrp, 0);
  return { cart, count, subtotal };
}
