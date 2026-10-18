import { getSession } from '@/lib/supabase/server';
import { loadPublisher } from '@/lib/publisher';
import { upcomingCons } from '@/lib/queries';
import { Empty } from '@/components/ui';
import { money, date } from '@/lib/roles';
import ConSignup from '@/components/ConSignup';

export const metadata = { title: 'Conventions' };

export default async function Conventions() {
  const { supabase, profile } = await getSession();
  const pub = await loadPublisher(supabase, profile);
  const [cons, { data: signups }] = await Promise.all([upcomingCons(supabase), pub ? supabase.from('con_signups').select('*, conventions(name, starts_on)').eq('publisher_id', pub.id) : { data: [] }]);
  const mine = c => (signups || []).filter(s => s.convention_id === c.id);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Where we'll be</div><h1>Conventions</h1><p className="note">Sign up for a demo slot, a table seat, or send stock on consignment. Ship-in instructions post here once you're confirmed.</p></div>
      <div className="panel">
        {cons.map(c => {
          const d = new Date(c.starts_on + 'T12:00'); const open = !c.signup_opens || c.signup_opens <= today;
          return (
            <div className="con" key={c.id}>
              <div className="date">{d.getDate()}<small>{d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small></div>
              <div><b>{c.name} · {c.city}</b><span className="note">{c.audience}. {c.shipin_deadline ? `Consignment ship-in by ${date(c.shipin_deadline)}. ` : ''}{c.demo_slots} demo slots.</span>
                {mine(c).length > 0 && <div style={{ marginTop: 4 }}>{mine(c).map(s => <span key={s.id} className="pill ok" style={{ marginRight: 6 }}>{s.kind.replace('_', ' ')} · {s.status}</span>)}</div>}</div>
              {pub && (open ? <ConSignup conventionId={c.id} publisherId={pub.id} hasSlots={c.demo_slots > 0} /> : <button className="btn ghost" disabled>Opens {date(c.signup_opens)}</button>)}
            </div>
          );
        })}
      </div>
      <div className="panel"><header><h2>Your con history</h2></header>
        {(signups || []).filter(s => s.units_sent).length ? <div className="tbl"><table><thead><tr><th>Con</th><th className="r">Sent</th><th className="r">Sold</th><th className="r">Returned</th></tr></thead><tbody>
          {signups.filter(s => s.units_sent).map(s => <tr key={s.id}><td className="k">{s.conventions?.name}</td><td className="r">{s.units_sent}</td><td className="r">{s.units_sold}</td><td className="r">{s.units_returned}</td></tr>)}
        </tbody></table></div> : <Empty>Counts in, sold, and returned post here after each con, with a statement.</Empty>}</div>
    </div></main>
  );
}
