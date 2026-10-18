'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';
import { Status } from '@/components/ui';
import { money, date } from '@/lib/roles';

const KINDS = [['dropship_sale', 'Drop ship sale'], ['consignment_sale', 'Consignment sale'], ['wholesale_sale', 'Wholesale purchase'], ['fee', 'Fee (marketing, con seat)'], ['shipping', 'Shipping'], ['adjustment', 'Adjustment']];

export default function Ledger({ entries, publishers, owed, payouts, orders }) {
  const router = useRouter();
  const [f, setF] = useState({ publisher_id: publishers[0]?.id || '', kind: 'dropship_sale', description: '', gross: '', cut_pct: '', status: 'waiting', order_id: '', entry_date: new Date().toISOString().slice(0, 10) });
  const [p, setP] = useState({ publisher_id: publishers[0]?.id || '', amount: '', method: 'ACH', reference: '' });
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const pub = publishers.find(x => x.id === f.publisher_id);
  const defaultPct = f.kind === 'dropship_sale' ? pub?.dropship_pct : f.kind === 'consignment_sale' ? pub?.consignment_pct : 0;
  const pct = f.cut_pct === '' ? Number(defaultPct || 0) : Number(f.cut_pct);
  const gross = Number(f.gross) || 0;
  const isSale = f.kind.endsWith('_sale');
  const cut = isSale && f.kind !== 'wholesale_sale' ? Math.round(gross * pct) / 100 : 0;
  const net = f.kind === 'wholesale_sale' ? gross : isSale ? gross - cut : -gross;

  async function addEntry() {
    if (!f.publisher_id || !gross) return toast('Pick a publisher and enter an amount');
    setBusy(true);
    const { error } = await createClient().from('ledger_entries').insert({ publisher_id: f.publisher_id, kind: f.kind, description: f.description || KINDS.find(k => k[0] === f.kind)[1], gross: isSale ? gross : 0, ebg_cut: cut, net_to_publisher: net, status: f.status, order_id: f.order_id || null, entry_date: f.entry_date });
    setBusy(false); if (error) return toast(error.message); toast('Entry added'); setF({ ...f, description: '', gross: '' }); router.refresh();
  }
  async function setStatus(id, status) {
    const { error } = await createClient().from('ledger_entries').update({ status }).eq('id', id);
    if (error) return toast(error.message); router.refresh();
  }
  async function recordPayout() {
    const amt = Number(p.amount); if (!p.publisher_id || !amt) return toast('Pick a publisher and amount');
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from('payouts').insert({ publisher_id: p.publisher_id, amount: amt, method: p.method, reference: p.reference });
    if (error) { setBusy(false); return toast(error.message); }
    // a payout is itself a ledger entry (negative), and everything ready becomes paid
    await supabase.from('ledger_entries').insert({ publisher_id: p.publisher_id, kind: 'payout', description: `Payout ${p.method} ${p.reference}`.trim(), net_to_publisher: -amt, status: 'paid' });
    await supabase.from('ledger_entries').update({ status: 'paid' }).eq('publisher_id', p.publisher_id).eq('status', 'ready');
    setBusy(false); toast('Payout recorded'); setP({ ...p, amount: '', reference: '' }); router.refresh();
  }
  const owedFor = id => owed.find(o => o.publisher_id === id);

  return (
    <div className="section">
      <div className="admin-grid">
        <div className="panel"><header><h3>Owed by publisher</h3></header>
          <div className="tbl"><table><thead><tr><th>Publisher</th><th className="r">Ready</th><th className="r">Waiting</th><th className="r">Paid out</th></tr></thead><tbody>
            {owed.map(o => <tr key={o.publisher_id}><td className="k">{o.name}</td><td className="r">{money(o.ready)}</td><td className="r">{money(o.waiting)}</td><td className="r">{money(o.paid_out)}</td></tr>)}
            {!owed.length && <tr><td colSpan={4} className="note">No publishers yet.</td></tr>}
          </tbody></table></div></div>
        <div className="panel"><header><h3>Record a payout</h3></header>
          <div className="rowform">
            <div className="field wide"><label>Publisher</label><select value={p.publisher_id} onChange={e => setP({ ...p, publisher_id: e.target.value })}>{publishers.map(x => <option key={x.id} value={x.id}>{x.orgs?.name}</option>)}</select></div>
            <div className="field"><label>Amount</label><input value={p.amount} onChange={e => setP({ ...p, amount: e.target.value })} placeholder={owedFor(p.publisher_id) ? String(owedFor(p.publisher_id).ready) : ''} /></div>
            <div className="field"><label>Method</label><select value={p.method} onChange={e => setP({ ...p, method: e.target.value })}><option>ACH</option><option>Check</option><option>PayPal</option><option>Zelle</option></select></div>
            <div className="field wide"><label>Reference (check no., confirmation)</label><input value={p.reference} onChange={e => setP({ ...p, reference: e.target.value })} /></div>
          </div>
          <p className="note">Recording a payout marks everything "ready" for that publisher as paid and logs the payout as a ledger line.</p>
          <div><button className="btn sm" onClick={recordPayout} disabled={busy}>Record payout</button></div></div>
      </div>

      <div className="panel"><header><h3>Add a ledger entry</h3><span className="note">Balances are computed from these. Never edit a balance, add an entry.</span></header>
        <div className="rowform">
          <div className="field wide"><label>Publisher</label><select value={f.publisher_id} onChange={set('publisher_id')}>{publishers.map(x => <option key={x.id} value={x.id}>{x.orgs?.name}</option>)}</select></div>
          <div className="field wide"><label>Kind</label><select value={f.kind} onChange={set('kind')}>{KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
          <div className="field"><label>Date</label><input type="date" value={f.entry_date} onChange={set('entry_date')} /></div>
          <div className="field wide"><label>Description</label><input value={f.description} onChange={set('description')} placeholder="Niles Community Schools PO 2201, 12 units" /></div>
          <div className="field"><label>{isSale ? 'Gross sale $' : 'Amount $'}</label><input value={f.gross} onChange={set('gross')} /></div>
          {isSale && f.kind !== 'wholesale_sale' && <div className="field"><label>Our cut % (default {defaultPct})</label><input value={f.cut_pct} onChange={set('cut_pct')} placeholder={String(defaultPct)} /></div>}
          <div className="field"><label>Status</label><select value={f.status} onChange={set('status')}><option value="waiting">waiting (school hasn't paid)</option><option value="ready">ready to pay</option><option value="paid">already paid</option></select></div>
          <div className="field wide"><label>Linked order (optional)</label><select value={f.order_id} onChange={set('order_id')}><option value="">none</option>{orders.map(o => <option key={o.id} value={o.id}>{o.kind === 'quote' ? 'Q' : 'O'}-{o.number} · {o.orgs?.name} · {money(o.total)}</option>)}</select></div>
        </div>
        <p className="note">Net to publisher: <b>{money(net)}</b>{cut ? ` (gross ${money(gross)}, our cut ${money(cut)})` : ''}</p>
        <div><button className="btn sm" onClick={addEntry} disabled={busy}>Add entry</button></div></div>

      <div className="panel"><header><h3>Ledger</h3></header>
        <div className="tbl"><table><thead><tr><th>Date</th><th>Publisher</th><th>Entry</th><th className="r">Gross</th><th className="r">Our cut</th><th className="r">Net</th><th>Status</th><th></th></tr></thead><tbody>
          {entries.map(e => <tr key={e.id}><td>{date(e.entry_date)}</td><td>{e.publishers?.orgs?.name}</td><td className="k">{e.description}</td><td className="r">{e.gross ? money(e.gross) : ''}</td><td className="r">{e.ebg_cut ? money(e.ebg_cut) : ''}</td><td className="r">{money(e.net_to_publisher)}</td><td><Status s={e.status} /></td>
            <td className="actions">{e.status === 'waiting' && <button className="btn sm ghost" onClick={() => setStatus(e.id, 'ready')}>School paid</button>}{e.status !== 'void' && e.kind !== 'payout' && <button className="btn sm ghost" onClick={() => setStatus(e.id, 'void')}>Void</button>}</td></tr>)}
          {!entries.length && <tr><td colSpan={8} className="note">Nothing yet. The first sale goes here.</td></tr>}
        </tbody></table></div></div>

      <div className="panel"><header><h3>Payouts</h3></header>
        <div className="tbl"><table><thead><tr><th>Date</th><th>Publisher</th><th>Method</th><th>Reference</th><th className="r">Amount</th></tr></thead><tbody>
          {payouts.map(x => <tr key={x.id}><td>{date(x.paid_at)}</td><td>{x.publishers?.orgs?.name}</td><td>{x.method}</td><td>{x.reference}</td><td className="r">{money(x.amount)}</td></tr>)}
          {!payouts.length && <tr><td colSpan={5} className="note">No payouts yet.</td></tr>}
        </tbody></table></div></div>
    </div>
  );
}
