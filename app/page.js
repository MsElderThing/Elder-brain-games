import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Cover from '@/components/Cover';
import { money } from '@/lib/roles';

export default async function Home() {
  const supabase = await createClient();
  const { data: games } = await supabase.from('games').select('*').eq('approved', true).order('score', { ascending: false, nullsFirst: false });
  const shelf = (games || []).filter(g => !g.is_kit).slice(0, 3);
  const kits = (games || []).filter(g => g.is_kit).slice(0, 3);
  return (
    <section className="page">
      <div className="thero">
        <div className="top"><div className="eyebrow" style={{ fontSize: '.8rem' }}>Games for classrooms, libraries, and co-ops</div><span className="stamp" style={{ fontSize: '.75rem' }}>Kid tested · Teacher approved</span></div>
        <div>
          <h1>Games that teach.<span className="alt">played, scored, and picked by</span>kids and teachers.</h1>
          <p>Every game we carry was demoed for our panel of teachers and kids. Each comes with a lesson plan, standards mapping, and a quote your office can approve.</p>
          <div className="cta"><Link href="/catalog" className="btn">Browse the catalog</Link><Link href="/signup" className="btn ghost">Create an account</Link></div>
          <div className="ticks" style={{ marginTop: 16 }}><span>Purchase orders welcome</span><span>Net 30 for schools</span><span>Tax-exempt friendly</span></div>
        </div>
        <div className="shelf">{shelf.map((g, i) => <Cover key={g.id} game={g} rotate={[-3, 2, -1][i]} />)}</div>
      </div>

      <div className="grid2">
        <div className="panel"><header><h2>How buying works</h2></header>
          <div className="steps" style={{ gridTemplateColumns: '1fr', border: 0, background: 'none' }}>
            <div className="step"><div className="num">1</div><b>Pick games</b>Filter by grade and subject. Every listing shows play time, group size, and what it teaches.</div>
            <div className="step"><div className="num">2</div><b>Get a quote or buy now</b>Teachers and districts get a PO-ready quote with our W-9 attached. Individuals and co-ops check out with a card.</div>
            <div className="step"><div className="num">3</div><b>We ship, you play</b>Lesson plans and standards maps land in your account the day you order.</div>
          </div></div>
        <div className="panel"><header><h2>Classroom kits</h2><span className="pill ok">Most popular</span></header>
          <p>A game plus enough copies for small groups, a printed lesson plan, and standards mapping for math, ELA, or SEL. Built to survive 30 kids a day.</p>
          <div className="tbl" style={{ marginTop: 12 }}><table><tbody>
            {kits.map(k => <tr key={k.id}><td className="k">{k.title}</td><td>{k.teaches}</td><td className="r">{money(k.msrp)}</td></tr>)}
          </tbody></table></div>
          <div style={{ marginTop: 12 }}><Link href="/catalog?f=Kits" className="btn ghost">See all kits</Link></div></div>
      </div>

      <div className="panel"><header><h2>Who we work with</h2><span className="note">Each account type gets its own dashboard</span></header>
        <div className="roles">
          <Link href="/signup?role=teacher" className="role"><b>Teachers</b><span>Quotes, lesson plans, wishlists, PD hours</span></Link>
          <Link href="/signup?role=district" className="role"><b>Districts and schools</b><span>Purchase orders, invoices, vendor paperwork</span></Link>
          <Link href="/signup?role=nonprofit" className="role"><b>Libraries and non-profits</b><span>Lending libraries, program sessions, grant quotes</span></Link>
          <Link href="/signup?role=individual" className="role"><b>Families and co-ops</b><span>Card checkout, co-op bundles, order history</span></Link>
          <Link href="/publishers" className="role"><b>Publishers</b><span>Apply to demo, sales, payouts, conventions</span></Link>
        </div></div>
    </section>
  );
}
