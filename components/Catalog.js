'use client';
import { useState } from 'react';
import Link from 'next/link';
import { GRADES, SUBJECTS, matches, ageText, playersText } from '@/lib/catalog';
import Art from '@/components/Art';
import AddButton from '@/components/AddButton';
import { money } from '@/lib/roles';

export default function Catalog({ games, initial, role }) {
  const [f, setF] = useState(initial);
  const list = games.filter(g => matches(g, f));
  const B = ({ k, children }) => <button className={f === k ? 'on' : ''} onClick={() => setF(k)}>{children}</button>;
  const all = [['All', 'Everything'], ...GRADES.filter(g => g.key !== 'Homeschool').map(g => [g.key, g.label]), ...SUBJECTS.map(s => [s, s])];
  return (
    <div className="shop">
      <aside className="filters">
        <div className="chips">{all.map(([k, l]) => <B key={k} k={k}>{l}</B>)}</div>
        <div className="list">
          <h4>Grade</h4>
          <B k="All">Everything</B>
          {GRADES.filter(g => g.key !== 'Homeschool').map(g => <B key={g.key} k={g.key}>{g.label}</B>)}
          <h4>Subject</h4>
          {SUBJECTS.map(s => <B key={s} k={s}>{s}</B>)}
          <p className="note" style={{ marginTop: 18 }}>Homeschool families: everything here is yours at co-op pricing once you sign in.</p>
        </div>
      </aside>
      <div className="grid">
        {list.map(g => (
          <div className="tile" key={g.id}>
            <Link href={`/games/${g.slug}`} className="art">
              <Art game={g} />
              {g.score >= 20 && <span className="seal">KID<br />TESTED</span>}
            </Link>
            <h3><Link href={`/games/${g.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{g.title}</Link></h3>
            <div className="meta">{ageText(g)} · {g.play_minutes} min · {playersText(g)}<br />{g.teaches}</div>
            <div className="buy"><span className="price">{money(g.msrp)}</span><AddButton game={g} role={role} small /></div>
          </div>
        ))}
        {list.length === 0 && <p className="note">Nothing here yet. The first approved games will show up as publishers come through the demo program.</p>}
      </div>
    </div>
  );
}
