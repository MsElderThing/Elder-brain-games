import { getSession } from '@/lib/supabase/server';
import PublisherCard from '@/components/admin/PublisherCard';
import { Empty } from '@/components/ui';

export const metadata = { title: 'Admin · Publishers' };

export default async function AdminPublishers() {
  const { supabase } = await getSession();
  const [{ data: pubs }, { data: owed }, { data: acc }, { data: versions }] = await Promise.all([
    supabase.from('publishers').select('*, orgs(name), games(id, title, approved), applications(id, game_title, status)').order('created_at'),
    supabase.from('publisher_owed').select('*'),
    supabase.from('agreement_acceptances').select('publisher_id, version_id, accepted_at'),
    supabase.from('agreement_versions').select('id, version').order('published_at', { ascending: false }),
  ]);
  const current = (versions || [])[0];
  const owedBy = Object.fromEntries((owed || []).map(o => [o.publisher_id, o]));
  const signed = pid => (acc || []).find(a => a.publisher_id === pid && a.version_id === current?.id);
  const needs = (pubs || []).filter(p => !p.w9_on_file || !p.payout_method || !signed(p.id)).length;
  return (
    <main className="content gutter"><div className="wrap section">
      <div><span className="kicker">Admin</span><h1>Publishers</h1>
        <p className="opening">{(pubs || []).length} publishers. {needs ? `${needs} still missing paperwork before they can be paid.` : 'Everyone has their paperwork in.'}</p></div>
      {(pubs || []).length ? pubs.map(p => <PublisherCard key={p.id} pub={p} owed={owedBy[p.id]} signed={signed(p.id)} currentVersion={current?.version} />) : <Empty>No publishers yet. They appear here the moment someone creates a publisher account.</Empty>}
    </div></main>
  );
}
