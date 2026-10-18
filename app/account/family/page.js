import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { orgOrders, ownedLessonPlans, itemsOf } from '@/lib/queries';
import { Stats, Status, Empty } from '@/components/ui';
import { money } from '@/lib/roles';

export const metadata = { title: 'My orders' };

export default async function Family() {
  const { supabase, profile } = await getSession();
  const [orders, plans] = await Promise.all([orgOrders(supabase, profile.org_id), ownedLessonPlans(supabase)]);
  const owned = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).reduce((a, o) => a + (o.order_lines || []).reduce((b, l) => b + l.qty, 0), 0);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Family account</div><h1>Your orders</h1></div>
      <p className="opening">{orders.length ? `${orders.length} order${orders.length > 1 ? 's' : ''} so far, ${plans.length} lesson plans unlocked.` : 'No orders yet. Every game you buy unlocks its homeschool lesson plan here.'}</p>
      <Stats items={[[orders.filter(o => o.status === 'paid' || o.status === 'shipped').length, 'On the way'], [owned, 'Games owned'], [plans.length, 'Lesson plans']]} />
      <div className="grid2">
        <div className="panel"><header><h2>Orders</h2><Link href="/catalog" className="btn ghost">Shop</Link></header>
          {orders.length ? <div className="tbl"><table><thead><tr><th>Order</th><th>Items</th><th className="r">Total</th><th>Status</th></tr></thead><tbody>
            {orders.map(o => <tr key={o.id}><td className="k">O-{o.number}</td><td>{itemsOf(o)}</td><td className="r">{money(o.total)}</td><td><Status s={o.status} /></td></tr>)}
          </tbody></table></div> : <Empty>No orders yet. Every game you buy unlocks its homeschool lesson plan here.</Empty>}</div>
        <div className="panel"><header><h2>Co-op bundles</h2><span className="pill new">Coming soon</span></header>
          <p className="note">Group buys for your co-op. Order together, we ship to one address and split receipts per family.</p></div>
        <div className="panel"><header><h2>Lesson plans</h2></header>
          {plans.length ? <div className="tbl"><table><tbody>{plans.map(p => <tr key={p.id}><td className="k">{p.games?.title}</td><td>{p.title}</td></tr>)}</tbody></table></div> : <Empty>Unlocks with your first order.</Empty>}</div>
      </div>
    </div></main>
  );
}
