// Shared server-side queries for buyer dashboards
export async function orgOrders(supabase, orgId) {
  const { data } = await supabase.from('orders').select('*, order_lines(qty, unit_price, games(title))').eq('org_id', orgId).neq('status', 'cart').order('created_at', { ascending: false });
  return data || [];
}
export async function ownedLessonPlans(supabase) {
  const { data } = await supabase.from('lesson_plans').select('*, games(title)').order('title');
  return data || [];
}
export async function upcomingCons(supabase) {
  const { data } = await supabase.from('conventions').select('*').gte('ends_on', new Date().toISOString().slice(0, 10)).order('starts_on');
  return data || [];
}
export const itemsOf = o => (o.order_lines || []).map(l => `${l.games?.title || 'Item'}${l.qty > 1 ? ' x' + l.qty : ''}`).join(', ');
