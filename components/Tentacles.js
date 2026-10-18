'use client';
import { useEffect, useRef } from 'react';

export default function Tentacles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); let w = 0, h = 0, raf;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function size() { const r = c.getBoundingClientRect(); if (!r.width) return; const d = devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; w = r.width; h = r.height; ctx.setTransform(d, 0, 0, d, 0, 0); }
    size(); addEventListener('resize', size);
    const arms = []; for (let i = 0; i < 9; i++) arms.push({ x: (i + .5) / 9 + (Math.random() - .5) * .08, len: .55 + Math.random() * .5, ph: Math.random() * 6, sp: .25 + Math.random() * .35, wid: 14 + Math.random() * 16, dir: Math.random() < .5 ? -1 : 1 });
    function draw(ts) {
      if (!w) size(); if (!w) { raf = requestAnimationFrame(draw); return; }
      const t = ts / 1000; ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a0f0b'); g.addColorStop(1, '#132018'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      arms.forEach(a => {
        const bx = a.x * w, by = h + 30, L = a.len * h; const pts = [];
        for (let s = 0; s <= 1; s += .04) { const y = by - s * L; const x = bx + a.dir * Math.sin(s * 2.4 + t * a.sp + a.ph) * 60 * s * s + Math.sin(t * a.sp * .7 + a.ph) * 10 * s; pts.push([x, y, s]); }
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.lineWidth = a.wid + 6; ctx.strokeStyle = '#070807'; ctx.stroke();
        ctx.lineWidth = a.wid; ctx.strokeStyle = '#2f5a2b'; ctx.stroke();
        ctx.lineWidth = a.wid * .45; ctx.strokeStyle = '#4f8a3f'; ctx.stroke();
        pts.forEach(([x, y, s], i) => { if (i % 3 !== 1 || s > .85) return; const r = (a.wid * .28) * (1 - s * .6); ctx.beginPath(); ctx.arc(x + a.dir * a.wid * .22, y, r, 0, 7); ctx.fillStyle = '#9fd36c'; ctx.fill(); ctx.beginPath(); ctx.arc(x + a.dir * a.wid * .22, y, r * .5, 0, 7); ctx.fillStyle = '#1b2e1a'; ctx.fill(); });
      });
      const v = ctx.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(7,8,7,.15)'); v.addColorStop(.45, 'rgba(7,8,7,.55)'); v.addColorStop(1, 'rgba(7,8,7,.85)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" />;
}
