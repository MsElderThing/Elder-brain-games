import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { orgOrders, ownedLessonPlans, upcomingCons, itemsOf } from '@/lib/queries';
import { Stats, Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';

export const metadata = { title: 'My classroom' };

export default async function Teacher() {
  const { supabase, profile } = await getSession();
  const [orders, plans, cons] = await Promise.all([orgOrders(supabase, profile.org_id), ownedLessonPlans(supabase), upcomingCons(supabase)]);
  const quotes = orders.filter(o => o.kind === 'quote' && ['quote_sent', 'approved', 'po_received'].includes(o.status));
  const owned = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).reduce((a, o) => a + (o.order_lines || []).reduce((b, l) => b + l.qty, 0), 0);
  return (
    <section className="page">
      <div><div className="eyebrow">Teacher account · {profile.orgs?.name}</div><h1>Your classroom</h1></div>
      <Stats items={[[quotes.length, 'Quotes awaiting your office'], [owned, 'Games in your classroom'], [plans.length, 'Lesson plans unlocked']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Quotes and orders</h2><Link href="/catalog" className="btn ghost">New quote</Link></header>
          {orders.length ? <div className="tbl"><table><thead><tr><th>Ref</th><th>Items</th><th className="r">Total</th><th>Status</th></tr></thead><tbody>
            {orders.map(o => <tr key={o.id}><td className="k">{o.kind === 'quote' ? 'Q-' : 'O-'}{o.number}</td><td>{itemsOf(o)}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No quotes yet. Add games from the catalog and check out to create your first PO-ready quote.</Empty>}
          <p className="note" style={{ marginTop: 10 }}>Quotes include our W-9 and are good for 60 days. Forward one to your office and they can approve it from their district account.</p></div>
        <div className="panel"><header><h2>Lesson plans</h2></header>
          {plans.length ? <div className="tbl"><table><tbody>{plans.map(p => <tr key={p.id}><td className="k">{p.games?.title} · {p.title}</td><td>{p.subject} {p.grade_band}</td></tr>)}</tbody></table></div>
            : <Empty>Lesson plans unlock here the day an order is paid.</Empty>}</div>
        <div className="panel"><header><h2>Workshops and events</h2></header>
          {cons.slice(0, 3).map(c => <div className="con" key={c.id}><div className="date">{new Date(c.starts_on + 'T12:00').getDate()}<small>{new Date(c.starts_on + 'T12:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small></div><div><b>{c.name}</b><span className="note">{c.city}. Come play at our table.</span></div></div>)}
        </div>
      </div>
    </section>
  );
}
