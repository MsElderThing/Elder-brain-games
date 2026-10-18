import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Tentacles from '@/components/Tentacles';
import PublisherApply from '@/components/PublisherApply';

export const metadata = { title: 'For publishers' };

export default async function Publishers() {
  const supabase = await createClient();
  const { data: cons } = await supabase.from('conventions').select('*').gte('ends_on', new Date().toISOString().slice(0, 10)).order('starts_on');
  const { data: { user } } = await supabase.auth.getUser();
  const slots = (cons || []).reduce((a, c) => a + (c.demo_slots || 0), 0);
  const next = (cons || [])[0];
  return (
    <main className="content gutter ink" style={{ background: 'var(--bg)', color: 'var(--fg)', marginBottom: -72, paddingBottom: 72 }}><div className="wrap section">
      <div className="handbill">
        <Tentacles />
        <div className="top"><div className="corner">Elder Brain Games · Publisher program</div><div className="tag"><span className="stamp">Now recruiting</span></div></div>
        <h1>Bring us<br />your game.<span className="alt">we'll get it into</span>classrooms.</h1>
        <p>We put tabletop games on teachers' shelves, in libraries, and in homeschool co-ops. Demo for a panel of teachers and kids. Winners get distribution, a catalog listing, a demo video, and a seat at our next con table.</p>
        <div className="cta"><a href="#apply" className="btn">Create a publisher account</a><a href="#scoring" className="btn ghost">How we score</a></div>
        <div className="fine">{slots} demo slots open{next ? ` · next round: ${next.name}, ${new Date(next.starts_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</div>
      </div>

      <div className="flow">
        <div><b>Apply</b><span>Game, ages, play time, MSRP, photos. Pick a slot.</span></div>
        <div><b>Demo</b><span>Video call, at our con table, or mail us a copy.</span></div>
        <div><b>Get scored</b><span>Every game gets a published scorecard back, win or not.</span></div>
        <div><b>Sign and sell</b><span>Paperwork online. Portal unlocks sales, payouts, cons.</span></div>
      </div>

      <div className="grid2">
        <div className="panel" id="apply">
          <header><h2>{user ? 'Apply to demo' : 'Create a publisher account and apply'}</h2><span className="pill new">Open slots: {slots}</span></header>
          <PublisherApply conventions={cons || []} signedIn={!!user} />
        </div>
        <div className="panel" id="scoring">
          <header><h2>How we score</h2><span className="stamp">Kid tested · Teacher approved</span></header>
          <div className="scoreboard">
            <span>Classroom fit</span><span className="note">one class period, group of 4 to 6</span><div className="bar"><i style={{ width: '100%' }}></i></div>
            <span>Learning value</span><span className="note">a subject or skill, clearly</span><div className="bar"><i style={{ width: '100%' }}></i></div>
            <span>Kid panel</span><span className="note">fun, rules clarity, play again</span><div className="bar"><i style={{ width: '100%' }}></i></div>
            <span>Durability</span><span className="note">survives 30 kids a day</span><div className="bar"><i style={{ width: '100%' }}></i></div>
            <span>Business readiness</span><span className="note">stock, drop ship, wholesale pricing</span><div className="bar"><i style={{ width: '100%' }}></i></div>
          </div>
          <p className="note" style={{ marginTop: 14 }}>Each line is scored 1 to 5 by every judge. 20 or more out of 25 earns the seal. Scorecards are posted to your account within 7 days of the demo, win or not.</p>
          <p className="note" style={{ marginTop: 10 }}>Already a publisher? <Link href="/signin">Sign in</Link>.</p>
        </div>
      </div>
    </div></main>
  );
}
