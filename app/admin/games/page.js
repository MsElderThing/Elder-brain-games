import { getSession } from '@/lib/supabase/server';
import GameEditor from '@/components/admin/GameEditor';
import { Empty } from '@/components/ui';

export const metadata = { title: 'Admin · Games' };

export default async function AdminGames() {
  const { supabase } = await getSession();
  const [{ data: games }, { data: pubs }, { data: apps }] = await Promise.all([
    supabase.from('games').select('*, publishers(orgs(name))').order('approved', { ascending: false }).order('title'),
    supabase.from('publishers').select('id, orgs(name)').order('created_at'),
    supabase.from('applications').select('*, publishers(orgs(name))').eq('status', 'accepted').order('created_at', { ascending: false }),
  ]);
  const listed = new Set((games || []).map(g => g.application_id).filter(Boolean));
  const unlisted = (apps || []).filter(a => !listed.has(a.id));
  const live = (games || []).filter(g => g.approved).length;
  return (
    <main className="content gutter"><div className="wrap section">
      <div><span className="kicker">Admin</span><h1>Games</h1>
        <p className="opening">{live} live in the shop, {(games || []).length - live} drafts. Only approved games appear on the site.</p></div>

      {unlisted.length > 0 && (
        <div className="panel"><header><h3>Accepted applications without a listing</h3></header>
          {unlisted.map(a => <GameEditor key={a.id} fromApplication={a} publishers={pubs || []} />)}
        </div>
      )}

      <div className="section"><header><h2>Listings</h2></header>
        {(games || []).length ? games.map(g => <GameEditor key={g.id} game={g} publishers={pubs || []} />) : <Empty>No listings yet. Accept an application on the Overview page and a "create listing" form appears here.</Empty>}
      </div>

      <div className="panel"><header><h3>Add a game by hand</h3></header><GameEditor publishers={pubs || []} /></div>
    </div></main>
  );
}
