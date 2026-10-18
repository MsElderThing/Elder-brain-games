import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { loadPublisher } from '@/lib/publisher';
import { Status, Empty } from '@/components/ui';
import { money } from '@/lib/roles';

export const metadata = { title: 'My games' };

export default async function MyGames() {
  const { supabase, profile } = await getSession();
  const pub = await loadPublisher(supabase, profile);
  if (!pub) return <main className="content gutter"><div className="wrap section"><Empty>No publisher record yet.</Empty></div></main>;
  const [{ data: games }, { data: apps }] = await Promise.all([
    supabase.from('games').select('*').eq('publisher_id', pub.id).order('title'),
    supabase.from('applications').select('*, scorecards(*)').eq('publisher_id', pub.id).order('created_at', { ascending: false }),
  ]);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Catalog</div><h1>My games</h1></div>
      <div className="grid2">
        {(games || []).map(g => (
          <div className="panel lift" key={g.id}><header><h3>{g.title}</h3>{g.approved && <span className="stamp" style={{ fontSize: '.7rem' }}>Approved</span>}</header>
            <div className="tbl"><table><tbody>
              <tr><td>Ages</td><td className="k">{g.age_min} to {g.age_max}</td></tr>
              <tr><td>Play time</td><td className="k">{g.play_minutes} min</td></tr>
              <tr><td>Teaches</td><td className="k">{g.teaches}</td></tr>
              <tr><td>MSRP / wholesale</td><td className="k">{money(g.msrp)} / {g.wholesale_price ? money(g.wholesale_price) : 'TBD'}</td></tr>
              <tr><td>Score</td><td className="k">{g.score ? `${g.score} / 25` : 'pending'}</td></tr>
            </tbody></table></div></div>
        ))}
        {(apps || []).map(a => {
          const n = (a.scorecards || []).length;
          return (
            <div className="panel" key={a.id}><header><h3>{a.game_title}</h3><Status s={a.status} /></header>
              <p className="note">Slot: {a.demo_slot}. {a.teaches}</p>
              <div className="score" style={{ marginTop: 12 }}><span>Judging progress</span><span className="note">{n} of 5 judges in</span><div className="bar"><i style={{ width: `${Math.min(100, n * 20)}%` }}></i></div></div>
            </div>
          );
        })}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 10, borderStyle: 'dashed' }}><h3>Submit another game</h3><p className="note">Approved publishers skip the queue for review slots.</p><Link href="/publishers#apply" className="btn">New application</Link></div>
      </div>
    </div></main>
  );
}
