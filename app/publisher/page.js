import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { loadPublisher, ledger, balances } from '@/lib/publisher';
import { Stats, Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';

export const metadata = { title: 'Publisher dashboard' };

export default async function PublisherHome() {
  const { supabase, profile } = await getSession();
  const pub = await loadPublisher(supabase, profile);
  if (!pub) return <section className="page"><Empty>No publisher record yet. <Link href="/publishers#apply">Apply to demo</Link> to create one.</Empty></section>;
  const [entries, { data: games }, { data: apps }] = await Promise.all([
    ledger(supabase, pub.id),
    supabase.from('games').select('*').eq('publisher_id', pub.id),
    supabase.from('applications').select('*').eq('publisher_id', pub.id).order('created_at', { ascending: false }),
  ]);
  const b = balances(entries);
  const units = entries.filter(e => e.kind.endsWith('_sale')).length;
  return (
    <section className="page">
      <div><div className="eyebrow">{pub.orgs?.name}</div><h1>Dashboard</h1></div>
      <Stats items={[[money(b.paid + b.ready + b.waiting), 'Earned, lifetime'], [money(b.ready), 'Ready to pay'], [money(b.waiting), 'Waiting on school payment'], [(games || []).length, 'Games in catalog']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Applications</h2><Link href="/publishers#apply" className="btn ghost">Apply with another game</Link></header>
          {(apps || []).length ? <div className="tbl"><table><thead><tr><th>Game</th><th>Slot</th><th>Status</th></tr></thead><tbody>
            {apps.map(a => <tr key={a.id}><td className="k">{a.game_title}</td><td>{a.demo_slot}</td><td><Status s={a.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No applications yet.</Empty>}</div>
        <div className="panel"><header><h2>Recent activity</h2></header>
          {entries.length ? <div className="tbl"><table><tbody>
            {entries.slice(0, 6).map(e => <tr key={e.id}><td>{date(e.entry_date)}</td><td className="k">{e.description}</td><td><Status s={e.status} /></td></tr>)}
          </tbody></table></div> : <Empty>Sales, consignment statements, and payouts show up here once your first game is approved.</Empty>}</div>
      </div>
    </section>
  );
}
