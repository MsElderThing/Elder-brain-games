import { redirect } from 'next/navigation';
import { getSession } from '@/lib/supabase/server';
import { Stats, Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';
import AdminActions from '@/components/AdminActions';

export const metadata = { title: 'Admin' };

export default async function Admin() {
  const { supabase, profile } = await getSession();
  if (!profile) redirect('/signin?next=/admin');
  if (profile.role !== 'admin') redirect('/');
  const [{ data: apps }, { data: orders }, { data: ledger }, { data: pubs }, { data: games }] = await Promise.all([
    supabase.from('applications').select('*, publishers(orgs(name)), scorecards(id)').order('created_at', { ascending: false }),
    supabase.from('orders').select('*, orgs(name)').neq('status', 'cart').order('created_at', { ascending: false }),
    supabase.from('ledger_entries').select('*').in('status', ['waiting', 'ready']),
    supabase.from('publishers').select('*, orgs(name)'),
    supabase.from('games').select('id, approved'),
  ]);
  const owed = (ledger || []).filter(e => e.status === 'ready').reduce((a, e) => a + Number(e.net_to_publisher), 0);
  const openInv = (orders || []).filter(o => ['approved', 'po_received', 'shipped', 'delivered'].includes(o.status) && !o.paid_at);
  return (
    <section className="page">
      <div><div className="eyebrow">Elder Brain only</div><h1>Admin</h1></div>
      <Stats items={[[(apps || []).filter(a => a.status !== 'accepted' && a.status !== 'declined').length, 'Applications to review'], [money(owed), 'Owed to publishers'], [money(openInv.reduce((a, o) => a + Number(o.total), 0)), 'Open school invoices'], [(games || []).filter(g => g.approved).length, 'Approved games'], [(pubs || []).length, 'Publishers']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Review queue</h2></header>
          {(apps || []).length ? <div className="tbl"><table><thead><tr><th>Game</th><th>Publisher</th><th>Slot</th><th>Judges</th><th>Status</th><th></th></tr></thead><tbody>
            {apps.map(a => <tr key={a.id}><td className="k">{a.game_title}</td><td>{a.publishers?.orgs?.name}</td><td>{a.demo_slot}</td><td>{(a.scorecards || []).length} / 5</td><td><Status s={a.status} /></td><td><AdminActions kind="app" id={a.id} status={a.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No applications yet.</Empty>}</div>
        <div className="panel"><header><h2>Quotes and invoices</h2></header>
          <p className="note" style={{ marginBottom: 10 }}>Marking an invoice paid moves any publisher drop-ship share from "waiting" to "ready to pay".</p>
          {(orders || []).length ? <div className="tbl"><table><thead><tr><th>Ref</th><th>Buyer</th><th className="r">Total</th><th>Status</th><th></th></tr></thead><tbody>
            {orders.map(o => <tr key={o.id}><td className="k">{o.kind === 'quote' ? 'Q-' : 'O-'}{o.number}</td><td>{o.orgs?.name}{o.po_number ? ` · PO ${o.po_number}` : ''}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td><td><AdminActions kind="order" id={o.id} status={o.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No orders yet.</Empty>}</div>
        <div className="panel"><header><h2>Publishers</h2></header>
          {(pubs || []).length ? <div className="tbl"><table><thead><tr><th>Publisher</th><th>Website</th><th>W-9</th></tr></thead><tbody>
            {pubs.map(p => <tr key={p.id}><td className="k">{p.orgs?.name}</td><td>{p.website}</td><td>{p.w9_on_file ? <span className="pill ok">on file</span> : <span className="pill wait">needed</span>}</td></tr>)}
          </tbody></table></div> : <Empty>No publishers yet.</Empty>}</div>
        <div className="panel"><header><h2>Payout run</h2></header>
          <p className="note">{money(owed)} ready across {new Set((ledger || []).filter(e => e.status === 'ready').map(e => e.publisher_id)).size} publishers. Payout batching and statements come with the Square connection.</p></div>
      </div>
    </section>
  );
}
