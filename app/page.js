import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { GRADES, ageText, panelNotes } from '@/lib/catalog';
import Art from '@/components/Art';
import Tentacles from '@/components/Tentacles';
import { PHOTOS, NOTE } from '@/lib/site';
import { money } from '@/lib/roles';
import AddButton from '@/components/AddButton';

export default async function Home() {
  const { supabase, profile } = await getSession();
  const { data: games } = await supabase.from('games').select('*').eq('approved', true).order('score', { ascending: false, nullsFirst: false });
  const all = games || [];
  const pick = all[0];
  const notes = pick ? panelNotes(pick) : [];
  return (
    <main className="content gutter">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <section className="hero">
          {PHOTOS.hero ? <img src={PHOTOS.hero} alt="" /> : <Tentacles />}
          <span className="stamp">Kid tested · Teacher approved</span>
          <div className="copy">
            <h1>Games your students will beg to play again.</h1>
            <p>Picked by teachers, scored by our kids, shipped with a lesson plan. Schools pay by purchase order.</p>
            <div className="cta"><Link href="/catalog" className="btn">Shop by grade</Link><Link href="/for-schools" className="btn ghost">How quotes work</Link></div>
          </div>
        </section>
        <div className="facts gutter" style={{ marginLeft: -18, marginRight: -18 }}>
          <div className="row wrap">
            <span><b>PO</b>Schools pay by purchase order, net 30.</span>
            <span><b>Plan</b>Every game ships with a lesson plan.</span>
            <span><b>Played</b>We played it first. Our kids scored it.</span>
          </div>
        </div>
      </div>

      <section className="wrap section">
        <header><h2>Shop by grade</h2><span className="note">Teachers think in grades. So do we.</span></header>
        <div className="grades">
          {GRADES.map(g => (
            <Link key={g.key} href={`/catalog?f=${encodeURIComponent(g.key)}`} className="grade">
              {PHOTOS.grades[g.key] ? <img src={PHOTOS.grades[g.key]} alt="" /> : <b className="big">{g.label}</b>}
              <span>{g.label}<small>{g.sub}</small></span>
            </Link>
          ))}
        </div>
      </section>

      {!pick && (
        <section className="wrap empty-shop">
          <div>
            <span className="kicker">The shelf, October 2026</span>
            <h2>The first games are being played right now.</h2>
            <p className="lede" style={{ marginTop: 10 }}>Every game we sell gets demoed at our table and scored by our kids before it goes up. The first round is in review. Leave your email and we'll tell you the day the shelf opens, or send us the game you wish your classroom had.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/signup?role=teacher" className="btn">Tell me when it opens</Link>
            <Link href="/publishers" className="btn ghost">I make games</Link>
          </div>
        </section>
      )}
      {pick && (
        <section className="wrap feature">
          <div className="art"><Art game={pick} /></div>
          <div className="body">
            <span className="kicker">Top of the shelf</span>
            <h2>{pick.title}</h2>
            <p>{pick.description || `${pick.teaches}. ${ageText(pick)}, ${pick.play_minutes} minutes, ${pick.players_min} to ${pick.players_max} players.`}</p>
            <div className="score">
              <span className="t">Kid panel · {pick.score} / 25</span>
              {notes.map((n, i) => <span key={i} style={{ gridColumn: '1/-1' }}>{n.name}{n.age ? `, ${n.age}` : ''}: “{n.quote}”</span>)}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 18, flexWrap: 'wrap' }}>
              <span className="price">{money(pick.msrp)}</span>
              <AddButton game={pick} role={profile?.role} />
              <Link href={`/games/${pick.slug}`} className="btn ghost sm">See the lesson plan</Link>
            </div>
          </div>
        </section>
      )}

      <section className="wrap notecard">
        <img src={PHOTOS.about || '/logo.jpg'} alt="Alex and Curtis" style={PHOTOS.about ? {} : { aspectRatio: '1', objectFit: 'contain', background: '#070807' }} />
        <div>
          <span className="date">{NOTE.date} · from the kitchen table</span>
          <h3>{NOTE.title}</h3>
          <p>{NOTE.body}</p>
          <p className="sig">{NOTE.sig}</p>
        </div>
      </section>

      <section className="wrap strip">
        <span className="kicker">Who we work with</span>
        <Link href="/signup?role=teacher">Teachers</Link>
        <Link href="/signup?role=district">Districts and schools</Link>
        <Link href="/signup?role=nonprofit">Libraries and non-profits</Link>
        <Link href="/signup?role=individual">Families and co-ops</Link>
        <Link href="/publishers">Publishers</Link>
      </section>
    </main>
  );
}
