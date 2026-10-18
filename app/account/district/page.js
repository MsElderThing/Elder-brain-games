import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { orgOrders, itemsOf } from '@/lib/queries';
import { Stats, Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';
import ApproveQuote from '@/components/ApproveQuote';

export const metadata = { title: 'Purchasing' };

export default async function District() {
  const { supabase, profile } = await getSession();
  const orders = await orgOrders(supabase, profile.org_id);
  const pending = orders.filter(o => o.status === 'quote_sent');
  const open = orders.filter(o => ['approved', 'po_received', 'shipped', 'delivered'].includes(o.status) && !o.paid_at);
  const openTotal = open.reduce((a, o) => a + Number(o.total), 0);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">District account · {profile.orgs?.name}</div><h1>Purchasing</h1></div>
      <p className="opening">{pending.length ? `${pending.length} quote${pending.length > 1 ? 's' : ''} waiting for your approval, ${money(openTotal)} in open invoices.` : open.length ? `Nothing to approve. ${money(openTotal)} in open invoices.` : 'Nothing waiting. Quotes your teachers request show up here.'}</p>
      <Stats items={[[pending.length, 'Quotes to approve'], [money(openTotal), 'Open invoices'], [profile.orgs?.tax_exempt ? 'On file' : 'Needed', 'Tax-exempt certificate']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Quotes awaiting approval</h2></header>
          {pending.length ? <div className="tbl"><table><thead><tr><th>Quote</th><th>Items</th><th className="r">Total</th><th></th></tr></thead><tbody>
            {pending.map(o => <tr key={o.id}><td className="k">Q-{o.number}</td><td>{itemsOf(o)}<br /><span className="note">valid to {date(o.quote_valid_until)}</span></td><td className="r">{money(o.total)}</td><td><ApproveQuote id={o.id} /></td></tr>)}
          </tbody></table></div> : <Empty>Nothing waiting. Quotes your teachers request show up here for approval.</Empty>}</div>
        <div className="panel"><header><h2>Purchase orders and invoices</h2></header>
          {orders.length ? <div className="tbl"><table><thead><tr><th>Ref</th><th>PO</th><th className="r">Amount</th><th>Status</th></tr></thead><tbody>
            {orders.map(o => <tr key={o.id}><td className="k">{o.kind === 'quote' ? 'Q-' : 'O-'}{o.number}</td><td>{o.po_number || ''}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No orders yet.</Empty>}</div>
        <div className="panel"><header><h2>Vendor paperwork</h2></header>
          <div className="tbl"><table><tbody>
            <tr><td className="k">W-9</td><td>Elder Brain Games LLC</td><td><span className="pill wait">coming soon</span></td></tr>
            <tr><td className="k">Certificate of insurance</td><td></td><td><span className="pill wait">coming soon</span></td></tr>
            <tr><td className="k">Your tax-exempt certificate</td><td>Michigan 3372</td><td>{profile.orgs?.tax_exempt ? <span className="pill ok">on file</span> : <span className="pill wait">send to hello@elderbraingames.com</span>}</td></tr>
          </tbody></table></div></div>
        <div className="panel"><header><h2>Bulk order</h2></header><p className="note">Order kits for several buildings at once and we'll split shipments and invoices by building.</p><Link href="/catalog" className="btn" style={{ marginTop: 12 }}>Start a bulk order</Link></div>
      </div>
    </div></main>
  );
}
