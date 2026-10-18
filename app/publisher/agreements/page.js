import { getSession } from '@/lib/supabase/server';
import { loadPublisher } from '@/lib/publisher';
import { Empty } from '@/components/ui';
import { date } from '@/lib/roles';
import AcceptAgreement from '@/components/AcceptAgreement';

export const metadata = { title: 'Agreements and paperwork' };

function md(s) {
  // tiny markdown: # headings, **bold**, paragraphs
  return s.split(/\n\n+/).map((p, i) => {
    if (p.startsWith('# ')) return <h4 key={i}>{p.slice(2)}</h4>;
    const parts = p.split(/\*\*(.+?)\*\*/g);
    return <p key={i}>{parts.map((x, j) => j % 2 ? <b key={j}>{x}</b> : x)}</p>;
  });
}

export default async function Agreements() {
  const { supabase, profile } = await getSession();
  const pub = await loadPublisher(supabase, profile);
  const [{ data: versions }, { data: acc }] = await Promise.all([
    supabase.from('agreement_versions').select('*').order('published_at', { ascending: false }),
    pub ? supabase.from('agreement_acceptances').select('*').eq('publisher_id', pub.id) : { data: [] },
  ]);
  const current = (versions || [])[0];
  const accepted = v => (acc || []).find(a => a.version_id === v.id);
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Living documents</div><h1>Agreements and paperwork</h1><p className="note">The current agreement is always shown here. When terms change, you accept the new version at login; every version you've signed stays on file with the date.</p></div>
      <div className="grid2">
        <div className="panel"><header><h2>Distribution agreement</h2>{current && (accepted(current) ? <span className="pill ok">v{current.version} · signed {date(accepted(current).accepted_at)}</span> : <span className="pill wait">v{current.version} · not yet accepted</span>)}</header>
          {current ? <>
            <div className="doc"><div className="v">Elder Brain Games LLC · Publisher Distribution Agreement · Version {current.version}</div>{md(current.body_md)}</div>
            {pub && !accepted(current) && <AcceptAgreement publisherId={pub.id} versionId={current.id} version={current.version} />}
          </> : <Empty>No agreement published yet.</Empty>}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel"><header><h3>Version history</h3></header>
            {(versions || []).map(v => <div className="version" key={v.id}><b>v{v.version}</b><span>{date(v.published_at)}</span>{accepted(v) ? <span className="pill ok">accepted {date(accepted(v).accepted_at)}</span> : <span className="pill paid">{v.id === current?.id ? 'current' : 'superseded'}</span>}<span className="note">{v.change_note}</span></div>)}</div>
          <div className="panel"><header><h3>Paperwork on file</h3></header>
            <div className="tbl"><table><tbody>
              <tr><td className="k">W-9</td><td>{pub?.orgs?.name}</td><td>{pub?.w9_on_file ? <span className="pill ok">on file</span> : <span className="pill wait">needed before first payout</span>}</td></tr>
              <tr><td className="k">Payout method</td><td>{pub?.payout_method || ''}</td><td>{pub?.payout_method ? <span className="pill ok">on file</span> : <span className="pill wait">needed</span>}</td></tr>
              <tr><td className="k">Confidentiality</td><td>Signed with application</td><td><span className="pill ok">on file</span></td></tr>
            </tbody></table></div>
            <p className="note" style={{ marginTop: 10 }}>Document uploads are coming. For now, email your W-9 to hello@elderbraingames.com.</p></div>
        </div>
      </div>
    </div></main>
  );
}
