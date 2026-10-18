import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';
import AdminActions from '@/components/AdminActions';

export const metadata = { title: 'Admin' };

export default async function Admin() {
  const { supabase } = await getSession();
  const [{ data: apps }, { data: owed }, { data: orders }, { data: games }, { data: pubs }, { data: signups }] = await Promise.all([
    supabase.from('applications').select('*, publishers(orgs(name)), scorecards(id)').order('created_at', { ascending: false }),
    supabase.from('publisher_owed').select('*'),
    supabase.from('orders').select('id, total, status, paid_at').neq('status', 'cart'),
    supabase.from('games').select('id, approved'),
    supabase.from('publishers').select('id, w9_on_file, payout_method'),
    supabase.from('con_signups').select('*, conventions(name), publishers(orgs(name))').eq('status', 'requested').order('created_at'),
  ]);
  const toReview = (apps || []).filter(a => !['accepted', 'declined'].includes(a.status));
  const ready = (owed || []).reduce((a, o) => a + Number(o.ready), 0);
  const openInv = (orders || []).filter(o => ['approved', 'po_received', 'shipped', 'delivered'].includes(o.status) && !o.paid_at);
  const live = (games || []).filter(g => g.approved).length;
  const paperwork = (pubs || []).filter(p => !p.w9_on_file || !p.payout_method).length;
  const todo = [
    toReview.length && [`${toReview.length} application${toReview.length > 1 ? 's' : ''} to review`, '#queue'],
    (signups || []).length && [`${signups.length} con slot request${signups.length > 1 ? 's' : ''} to confirm`, '#cons'],
    openInv.length && [`${openInv.length} school invoice${openInv.length > 1 ? 's' : ''} to mark paid when the check lands`, '/admin/orders'],
    ready > 0 && [`${money(ready)} ready to pay out`, '/admin/money'],
    paperwork && [`${paperwork} publisher${paperwork > 1 ? 's' : ''} missing W-9 or payout details`, '/admin/publishers'],
  ].filter(Boolean);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><span className="kicker">Elder Brain only</span><h1>Overview</h1>
        <p className="opening">{live} game{live === 1 ? '' : 's'} live in the shop, {(pubs || []).length} publisher{(pubs || []).length === 1 ? '' : 's'} signed up.</p></div>
      <div className="grid2">
        <div className="panel"><header><h3>To do</h3></header>
          {todo.length ? <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>{todo.map(([t, h]) => <li key={t}><Link href={h}>{t}</Link></li>)}</ul> : <p className="note">Nothing waiting on you.</p>}</div>
        <div className="panel"><header><h3>Shortcuts</h3></header>
          <div className="actions"><Link href="/admin/games" className="btn sm ghost">Games</Link><Link href="/admin/publishers" className="btn sm ghost">Publishers</Link><Link href="/admin/money" className="btn sm ghost">Money</Link><Link href="/admin/orders" className="btn sm ghost">Orders</Link><Link href="/catalog" className="btn sm ghost">See the shop</Link></div></div>
      </div>
      <div className="panel" id="queue"><header><h3>Review queue</h3><span className="note">Accepting creates a listing form on the Games page.</span></header>
        {(apps || []).length ? <div className="tbl"><table><thead><tr><th>Game</th><th>Publisher</th><th>Slot</th><th>Judges</th><th>Status</th><th></th></tr></thead><tbody>
          {apps.map(a => <tr key={a.id}><td className="k">{a.game_title}<br /><span className="note">{a.ages} · {a.play_time} · {a.msrp ? money(a.msrp) : ''}</span></td><td>{a.publishers?.orgs?.name}</td><td>{a.demo_slot}</td><td>{(a.scorecards || []).length} / 5</td><td><Status s={a.status} /></td><td><AdminActions kind="app" id={a.id} status={a.status} /></td></tr>)}
        </tbody></table></div> : <Empty>No applications yet. They arrive from the publisher page.</Empty>}</div>
      <div className="panel" id="cons"><header><h3>Con slot requests</h3></header>
        {(signups || []).length ? <div className="tbl"><table><thead><tr><th>Con</th><th>Publisher</th><th>Request</th><th></th></tr></thead><tbody>
          {signups.map(s => <tr key={s.id}><td className="k">{s.conventions?.name}</td><td>{s.publishers?.orgs?.name}</td><td>{s.kind.replace('_', ' ')}</td><td><AdminActions kind="signup" id={s.id} status={s.status} /></td></tr>)}
        </tbody></table></div> : <p className="note">None waiting.</p>}</div>
    </div></main>
  );
}
