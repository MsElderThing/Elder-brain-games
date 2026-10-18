import { getSession } from '@/lib/supabase/server';
import { loadPublisher, ledger, balances } from '@/lib/publisher';
import { Stats, Status, Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';

export const metadata = { title: 'Balances and payouts' };
const KIND = { dropship_sale: 'Drop ship', consignment_sale: 'Consignment', wholesale_sale: 'Wholesale', fee: 'Fee', shipping: 'Shipping', payout: 'Payout', adjustment: 'Adjustment' };

export default async function Balances() {
  const { supabase, profile } = await getSession();
  const pub = await loadPublisher(supabase, profile);
  if (!pub) return <main className="content gutter"><div className="wrap section"><Empty>No publisher record yet.</Empty></div></main>;
  const [entries, { data: payouts }] = await Promise.all([ledger(supabase, pub.id), supabase.from('payouts').select('*').eq('publisher_id', pub.id).order('paid_at', { ascending: false })]);
  const b = balances(entries);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Ledger</div><h1>Balances and payouts</h1><p className="note">Every number here comes from a ledger entry. Statements always reconcile to this list.</p></div>
      <Stats items={[[money(b.ready), 'Ready to pay'], [money(b.waiting), 'Waiting on school payment'], [money((payouts || []).reduce((a, p) => a + Number(p.amount), 0)), 'Paid to you, lifetime']]} />
      <div className="panel"><header><h2>Entries</h2></header>
        {entries.length ? <div className="tbl"><table><thead><tr><th>Date</th><th>Entry</th><th>Type</th><th className="r">Gross</th><th className="r">EBG cut</th><th className="r">Yours</th><th>Status</th></tr></thead><tbody>
          {entries.map(e => <tr key={e.id}><td>{date(e.entry_date)}</td><td className="k">{e.description}</td><td>{KIND[e.kind]}</td><td className="r">{e.gross ? money(e.gross) : ''}</td><td className="r">{e.ebg_cut ? money(e.ebg_cut) : ''}</td><td className="r">{money(e.net_to_publisher)}</td><td><Status s={e.status} /></td></tr>)}
        </tbody></table></div> : <Empty>No entries yet. Your terms: {pub.dropship_pct}% on drop ship, {pub.consignment_pct}% on consignment, {pub.wholesale_discount_pct}% off MSRP wholesale.</Empty>}</div>
      <div className="panel"><header><h2>Payouts</h2></header>
        {(payouts || []).length ? <div className="tbl"><table><thead><tr><th>Date</th><th>Method</th><th>Reference</th><th className="r">Amount</th></tr></thead><tbody>
          {payouts.map(p => <tr key={p.id}><td>{date(p.paid_at)}</td><td>{p.method}</td><td>{p.reference}</td><td className="r">{money(p.amount)}</td></tr>)}
        </tbody></table></div> : <Empty>Payouts run on the last business day of each month for anything marked ready.</Empty>}</div>
    </div></main>
  );
}
