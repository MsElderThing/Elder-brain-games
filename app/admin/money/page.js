import { getSession } from '@/lib/supabase/server';
import Ledger from '@/components/admin/Ledger';
import { money } from '@/lib/roles';

export const metadata = { title: 'Admin · Money' };

export default async function AdminMoney() {
  const { supabase } = await getSession();
  const [{ data: entries }, { data: pubs }, { data: owed }, { data: payouts }, { data: orders }] = await Promise.all([
    supabase.from('ledger_entries').select('*, publishers(orgs(name))').order('entry_date', { ascending: false }).limit(200),
    supabase.from('publishers').select('id, dropship_pct, consignment_pct, orgs(name)').order('created_at'),
    supabase.from('publisher_owed').select('*'),
    supabase.from('payouts').select('*, publishers(orgs(name))').order('paid_at', { ascending: false }).limit(50),
    supabase.from('orders').select('id, number, total, status, paid_at, orgs(name)').neq('status', 'cart').order('created_at', { ascending: false }).limit(50),
  ]);
  const ready = (owed || []).reduce((a, o) => a + Number(o.ready), 0);
  const waiting = (owed || []).reduce((a, o) => a + Number(o.waiting), 0);
  const openInv = (orders || []).filter(o => ['approved', 'po_received', 'shipped', 'delivered'].includes(o.status) && !o.paid_at);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><span className="kicker">Admin</span><h1>Money</h1>
        <p className="opening">{money(ready)} owed to publishers and ready to pay. {money(waiting)} more once schools pay {openInv.length} open invoice{openInv.length === 1 ? '' : 's'} totaling {money(openInv.reduce((a, o) => a + Number(o.total), 0))}.</p></div>
      <Ledger entries={entries || []} publishers={pubs || []} owed={owed || []} payouts={payouts || []} orders={orders || []} />
    </div></main>
  );
}
