import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { orgOrders, upcomingCons, itemsOf } from '@/lib/queries';
import { Stats, Status, Empty } from '@/components/ui';
import { money } from '@/lib/roles';

export const metadata = { title: 'Programs and lending' };

export default async function Nonprofit() {
  const { supabase, profile } = await getSession();
  const [orders, cons] = await Promise.all([orgOrders(supabase, profile.org_id), upcomingCons(supabase)]);
  const owned = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).reduce((a, o) => a + (o.order_lines || []).reduce((b, l) => b + l.qty, 0), 0);
  return (
    <section className="page">
      <div><div className="eyebrow">Library and non-profit account · {profile.orgs?.name}</div><h1>Programs and lending</h1></div>
      <Stats items={[[owned, 'Games in your collection'], [orders.filter(o => o.status === 'quote_sent').length, 'Quotes in progress'], [profile.orgs?.tax_exempt ? 'On file' : 'Needed', 'Tax-exempt letter']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Quotes and orders</h2><Link href="/catalog" className="btn ghost">New quote</Link></header>
          {orders.length ? <div className="tbl"><table><thead><tr><th>Ref</th><th>Items</th><th className="r">Total</th><th>Status</th></tr></thead><tbody>
            {orders.map(o => <tr key={o.id}><td className="k">{o.kind === 'quote' ? 'Q-' : 'O-'}{o.number}</td><td>{itemsOf(o)}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td></tr>)}
          </tbody></table></div> : <Empty>We write quotes in the format most grant applications want: itemized, with learning outcomes per title. Start one from the catalog.</Empty>}</div>
        <div className="panel"><header><h2>Lending library</h2><span className="pill new">Coming 2027</span></header>
          <p className="note">A rotating box each semester. Swap titles, keep what circulates, and we replace worn copies. Email hello@elderbraingames.com to get on the list.</p></div>
        <div className="panel"><header><h2>Program sessions</h2></header>
          <p className="note">Family game nights, teen RPG club kickoffs, and staff training. We run them, or send a facilitator guide.</p>
          <a className="btn ghost" style={{ marginTop: 12 }} href="mailto:hello@elderbraingames.com?subject=Program session request">Request a session</a></div>
        <div className="panel"><header><h2>Where we'll be</h2></header>
          {cons.slice(0, 3).map(c => <div className="con" key={c.id}><div className="date">{new Date(c.starts_on + 'T12:00').getDate()}<small>{new Date(c.starts_on + 'T12:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small></div><div><b>{c.name}</b><span className="note">{c.city} · {c.audience}</span></div></div>)}</div>
      </div>
    </section>
  );
}
