import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';
import { boxArt, ageText, playersText, KID_NOTES } from '@/lib/catalog';
import { money } from '@/lib/roles';
import AddButton from '@/components/AddButton';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const { supabase, profile } = await getSession();
  const { data: g } = await supabase.from('games').select('*, publishers(orgs(name), website)').eq('slug', slug).eq('approved', true).maybeSingle();
  if (!g) notFound();
  const { data: kits } = await supabase.from('games').select('*').eq('approved', true).eq('is_kit', true).ilike('teaches', `%${g.title.split(' ')[0]}%`);
  const notes = KID_NOTES[g.slug] || [];
  const role = profile?.role;
  return (
    <main className="content gutter">
      <div className="wrap">
        <p className="note" style={{ marginBottom: 14 }}><Link href="/catalog">Catalog</Link> / {g.grade_bands?.[0]}</p>
        <div className="product">
          <div>
            <div className="art"><img src={boxArt(g)} alt={g.title} /></div>
            <div className="thumbs">
              <img src="/img/detail-cards.jpg" alt="Components" />
              <img src="/img/detail-board.jpg" alt="Mid-play" />
              <img src="/img/detail-boxes.jpg" alt="Lesson plan" />
            </div>
          </div>
          <div>
            <span className="kicker">{g.subjects?.join(' · ')} · {g.grade_bands?.join(', ')}</span>
            <h1>{g.title}</h1>
            <p className="lede" style={{ marginTop: 10 }}>{g.teaches}. {g.is_kit ? 'Enough copies for the whole room, a printed lesson plan, and a storage box that survives a closet.' : 'Fits inside one class period. Rules teach in five minutes.'}</p>
            <div className="specs">
              <div><b>{ageText(g).replace('ages ', '')}</b><span>Ages</span></div>
              <div><b>{g.play_minutes} min</b><span>Play time</span></div>
              <div><b>{playersText(g).replace(' players', '')}</b><span>Players</span></div>
              {g.score && <div><b>{g.score} / 25</b><span>Kid panel</span></div>}
            </div>
            <div className="buybox">
              <div className="row"><span className="price" style={{ fontSize: '1.6rem' }}>{money(g.msrp)}</span>{g.score >= 20 && <span className="stamp paper" style={{ fontSize: '.75rem' }}>Kid tested · Teacher approved</span>}</div>
              <div className="row">
                <AddButton game={g} role={role} />
                <span className="note">{role && role !== 'individual' ? 'Goes on your quote. W-9 included, net 30.' : 'Schools: create an account to get a PO-ready quote instead.'}</span>
              </div>
              {(kits || []).filter(k => k.id !== g.id).map(k => (
                <div className="row" key={k.id} style={{ borderTop: '2px solid var(--line)', paddingTop: 10 }}>
                  <span><b>Classroom kit:</b> {k.teaches}</span><span className="price">{money(k.msrp)}</span><AddButton game={k} role={role} small />
                </div>
              ))}
            </div>
            <div className="panelq">
              <h3>What it teaches</h3>
              <p>{g.teaches}. The lesson plan maps to {g.subjects?.[0] || 'the subject'} standards for {g.grade_bands?.[0]?.toLowerCase() || 'the grade band'}, with a 30-minute version and a two-session version, discussion questions, and an exit ticket. It unlocks in your account the day the order is paid.</p>
            </div>
            {notes.length > 0 && (
              <div className="panelq">
                <h3>What the kid panel said</h3>
                {notes.map(([n, a, q]) => <div className="quote-kid" key={n}>“{q}” <b>{n}, {a}</b></div>)}
              </div>
            )}
            <p className="note" style={{ marginTop: 16 }}>Published by {g.publishers?.orgs?.name || 'a small studio we met at a con'}. {g.dropship_available ? 'Ships from the publisher within three business days.' : 'Ships from our shelf.'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
