'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';
import { money, date } from '@/lib/roles';

export default function PublisherCard({ pub, owed, signed, currentVersion }) {
  const router = useRouter();
  const [f, setF] = useState({ w9_on_file: !!pub.w9_on_file, coi_on_file: !!pub.coi_on_file, safety_docs_on_file: !!pub.safety_docs_on_file, payout_method: pub.payout_method || '', contact_email: pub.contact_email || '', website: pub.website || '', notes: pub.notes || '', dropship_pct: pub.dropship_pct, consignment_pct: pub.consignment_pct, wholesale_discount_pct: pub.wholesale_discount_pct });
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  async function save() {
    setBusy(true);
    const { error } = await createClient().from('publishers').update({ ...f, dropship_pct: Number(f.dropship_pct), consignment_pct: Number(f.consignment_pct), wholesale_discount_pct: Number(f.wholesale_discount_pct) }).eq('id', pub.id);
    setBusy(false); if (error) return toast(error.message); toast('Saved'); router.refresh();
  }
  const ok = v => <span className={'pill ' + (v ? 'ok' : 'wait')}>{v ? 'on file' : 'needed'}</span>;
  return (
    <div className="panel">
      <header>
        <div><h3>{pub.orgs?.name}</h3><span className="note">{(pub.games || []).filter(g => g.approved).length} live games · {(pub.applications || []).length} applications · joined {date(pub.created_at)}</span></div>
        <div className="actions" style={{ alignItems: 'center' }}>
          {owed && <span className="note">Ready to pay <b>{money(owed.ready)}</b> · waiting {money(owed.waiting)} · paid out {money(owed.paid_out)}</span>}
        </div>
      </header>
      <div className="tbl"><table><tbody>
        <tr><td className="k">Agreement v{currentVersion}</td><td>{signed ? `accepted ${date(signed.accepted_at)}` : 'not yet accepted (they do this in their portal)'}</td><td>{ok(!!signed)}</td></tr>
        <tr><td className="k">W-9</td><td><label className="check"><input type="checkbox" checked={f.w9_on_file} onChange={set('w9_on_file')} />received</label></td><td>{ok(f.w9_on_file)}</td></tr>
        <tr><td className="k">Payout method</td><td><input value={f.payout_method} onChange={set('payout_method')} placeholder="ACH ···4417, PayPal, check" /></td><td>{ok(!!f.payout_method)}</td></tr>
        <tr><td className="k">Certificate of insurance</td><td><label className="check"><input type="checkbox" checked={f.coi_on_file} onChange={set('coi_on_file')} />received</label></td><td>{ok(f.coi_on_file)}</td></tr>
        <tr><td className="k">Product safety docs</td><td><label className="check"><input type="checkbox" checked={f.safety_docs_on_file} onChange={set('safety_docs_on_file')} />received</label></td><td>{ok(f.safety_docs_on_file)}</td></tr>
      </tbody></table></div>
      <div className="rowform">
        <div className="field"><label>Drop ship, our cut %</label><input type="number" value={f.dropship_pct} onChange={set('dropship_pct')} /></div>
        <div className="field"><label>Consignment, our cut %</label><input type="number" value={f.consignment_pct} onChange={set('consignment_pct')} /></div>
        <div className="field"><label>Wholesale discount %</label><input type="number" value={f.wholesale_discount_pct} onChange={set('wholesale_discount_pct')} /></div>
        <div className="field"><label>Contact email</label><input value={f.contact_email} onChange={set('contact_email')} /></div>
        <div className="field"><label>Website</label><input value={f.website} onChange={set('website')} /></div>
      </div>
      <div className="field"><label>Notes (only you see these)</label><textarea rows={2} value={f.notes} onChange={set('notes')} /></div>
      <div><button className="btn sm" onClick={save} disabled={busy}>Save</button></div>
    </div>
  );
}
