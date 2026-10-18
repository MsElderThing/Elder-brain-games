'use client';
import { useState } from 'react';
import Cover from '@/components/Cover';
import { addToCart } from '@/lib/cart';
import { toast } from '@/components/Toast';
import { money } from '@/lib/roles';

const TAGS = ['All', 'Kits', 'Math', 'ELA', 'STEM', 'Social studies', 'Grades K to 3', 'Grades 4 to 8', 'Grades 6 to 12'];

export default function CatalogGrid({ games, initial }) {
  const [f, setF] = useState(initial);
  const list = games.filter(g => f === 'All' || (g.subjects || []).includes(f) || (g.grade_bands || []).includes(f));
  return (
    <>
      <div className="filters">{TAGS.map(t => <button key={t} className={t === f ? 'on' : ''} onClick={() => setF(t)}>{t}</button>)}</div>
      <div className="catgrid">
        {list.map(g => (
          <div className="card" key={g.id}>
            <Cover game={g} />
            <h3>{g.title}</h3>
            <div className="meta">{g.teaches}<br />{g.play_minutes} min · {g.players_min === 1 ? `up to ${g.players_max}` : `${g.players_min} to ${g.players_max} players`}</div>
            <div className="price"><b>{money(g.msrp)}</b><button className="btn" onClick={() => { addToCart(g); toast('Added to cart'); }}>Add</button></div>
          </div>
        ))}
        {list.length === 0 && <p className="note">Nothing in this filter yet.</p>}
      </div>
    </>
  );
}
