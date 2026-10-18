import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { GRADES, boxArt, ageText, KID_NOTES } from '@/lib/catalog';
import { money } from '@/lib/roles';
import AddButton from '@/components/AddButton';

export default async function Home() {
  const { supabase, profile } = await getSession();
  const { data: games } = await supabase.from('games').select('*').eq('approved', true).order('score', { ascending: false, nullsFirst: false });
  const all = games || [];
  const pick = all.find(g => g.slug === 'cartographers-apprentice') || all[0];
  const notes = pick ? KID_NOTES[pick.slug] || [] : [];
  return (
    <main className="content gutter">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <section className="hero">
          <img src="/img/hero.jpg" alt="" />
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
              <img src={g.img} alt="" />
              <span>{g.label}<small>{g.sub}</small></span>
            </Link>
          ))}
        </div>
      </section>

      {pick && (
        <section className="wrap feature">
          <div className="art"><img src={boxArt(pick)} alt={pick.title} /></div>
          <div className="body">
            <span className="kicker">Game of the month · October</span>
            <h2>{pick.title}</h2>
            <p>{pick.teaches}. {ageText(pick)}, {pick.play_minutes} minutes, {pick.players_min} to {pick.players_max} players. This is the one I hand a fifth-grade teacher first: it fits in a class period, the map pieces survive being dropped, and the fractions are load-bearing instead of decorative.</p>
            <div className="score">
              <span className="t">Kid panel · {pick.score} / 25</span>
              {notes.map(([n, a, q]) => <span key={n} style={{ gridColumn: '1/-1' }}>{n}, {a}: “{q}”</span>)}
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
        <img src="/img/about.jpg" alt="Alex and Curtis" />
        <div>
          <span className="date">October 18, 2026 · from the kitchen table</span>
          <h3>We're back from Gamehole Con, and the shelf is open.</h3>
          <p>Elder Brain Games started because we homeschool and kept finding games that taught something real, then watched teacher friends have no way to buy them with school money. So we built the thing we wanted: a shop where every game has been played at our table, scored by our kids, and comes with a quote your office can approve. The first ten games are up. Publishers, we're recruiting. Teachers, tell us what you need for your room and we'll find it.</p>
          <p className="sig">Alex and Curtis, Niles, Michigan</p>
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
