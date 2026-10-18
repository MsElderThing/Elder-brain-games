import { getSession } from '@/lib/supabase/server';
import Catalog from '@/components/Catalog';

export const metadata = { title: 'Shop by grade' };

export default async function CatalogPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase, profile } = await getSession();
  const { data: games } = await supabase.from('games').select('*').eq('approved', true).order('title');
  return (
    <main className="content gutter">
      <div className="wrap section">
        <header>
          <div><span className="kicker">Catalog</span><h1>Every game here has been played at our table.</h1></div>
          <p className="note" style={{ maxWidth: '36ch' }}>{profile && profile.role !== 'individual' ? 'You build a quote. Your office approves it. Net 30.' : 'Prices are retail. Schools get a PO-ready quote instead of a cart.'}</p>
        </header>
        <Catalog games={games || []} initial={sp?.f || 'All'} role={profile?.role} />
      </div>
    </main>
  );
}
