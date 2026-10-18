import { getSession } from '@/lib/supabase/server';
import { Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';
import AdminActions from '@/components/AdminActions';
import { itemsOf } from '@/lib/queries';

export const metadata = { title: 'Admin · Orders' };

export default async function AdminOrders() {
  const { supabase } = await getSession();
  const { data: orders } = await supabase.from('orders').select('*, orgs(name, kind), profiles:created_by(full_name, email), order_lines(qty, unit_price, games(title))').neq('status', 'cart').order('created_at', { ascending: false });
  const open = (orders || []).filter(o => !o.paid_at && o.status !== 'cancelled');
  return (
    <main className="content gutter"><div className="wrap section">
      <div><span className="kicker">Admin</span><h1>Quotes and orders</h1>
        <p className="opening">{open.length ? `${open.length} open, ${money(open.reduce((a, o) => a + Number(o.total), 0))} unpaid. Marking a school invoice paid is what moves publisher money to "ready".` : 'Nothing open. Quotes and card orders land here as they come in.'}</p></div>
      <div className="panel">
        {(orders || []).length ? <div className="tbl"><table><thead><tr><th>Ref</th><th>Buyer</th><th>Items</th><th className="r">Total</th><th>Status</th><th>Dates</th><th></th></tr></thead><tbody>
          {orders.map(o => <tr key={o.id}><td className="k">{o.kind === 'quote' ? 'Q-' : 'O-'}{o.number}</td><td>{o.orgs?.name}<br /><span className="note">{o.profiles?.full_name} · {o.profiles?.email}{o.po_number ? ` · PO ${o.po_number}` : ''}</span></td><td>{itemsOf(o)}{o.notes ? <><br /><span className="note">{o.notes}</span></> : null}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td><td className="note">{date(o.created_at)}{o.quote_valid_until ? <><br />valid to {date(o.quote_valid_until)}</> : null}{o.paid_at ? <><br />paid {date(o.paid_at)}</> : null}</td><td><AdminActions kind="order" id={o.id} status={o.status} /></td></tr>)}
        </tbody></table></div> : <Empty>No orders yet.</Empty>}
      </div>
    </div></main>
  );
}
