import { createClient } from '@/lib/supabase/server';
import CatalogGrid from '@/components/CatalogGrid';

export const metadata = { title: 'Catalog' };

export default async function Catalog({ searchParams }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: games } = await supabase.from('games').select('*').eq('approved', true).order('title');
  return (
    <section className="page">
      <div><div className="eyebrow">Catalog</div><h1>Shop games and kits</h1><p className="note">Prices shown are retail. School, district, and library accounts check out as a PO-ready quote.</p></div>
      <CatalogGrid games={games || []} initial={sp?.f || 'All'} />
    </section>
  );
}
