export async function loadPublisher(supabase, profile) {
  let q = supabase.from('publishers').select('*, orgs(name)');
  if (profile.role === 'admin') q = q.limit(1); else q = q.eq('org_id', profile.org_id);
  const { data } = await q.maybeSingle();
  return data;
}
export async function ledger(supabase, publisherId) {
  const { data } = await supabase.from('ledger_entries').select('*').eq('publisher_id', publisherId).order('entry_date', { ascending: false });
  return data || [];
}
export function balances(entries) {
  const sum = f => entries.filter(f).reduce((a, e) => a + Number(e.net_to_publisher), 0);
  return {
    waiting: sum(e => e.status === 'waiting'),
    ready: sum(e => e.status === 'ready'),
    paid: sum(e => e.status === 'paid' && e.kind !== 'payout'),
  };
}
