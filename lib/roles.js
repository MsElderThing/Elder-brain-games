export const ROLE_HOME = {
  teacher: '/account/teacher',
  district: '/account/district',
  nonprofit: '/account/nonprofit',
  individual: '/account/family',
  publisher: '/publisher',
  admin: '/admin',
};

export const ROLE_LABEL = {
  teacher: 'Teacher',
  district: 'District or school',
  nonprofit: 'Library or non-profit',
  individual: 'Family or co-op',
  publisher: 'Publisher',
  admin: 'Elder Brain staff',
};

export const ROLE_NAV = {
  teacher: [['/account/teacher', 'My classroom'], ['/catalog', 'Catalog']],
  district: [['/account/district', 'Purchasing'], ['/catalog', 'Catalog']],
  nonprofit: [['/account/nonprofit', 'Programs and lending'], ['/catalog', 'Catalog']],
  individual: [['/account/family', 'My orders'], ['/catalog', 'Catalog']],
  publisher: [['/publisher', 'Dashboard'], ['/publisher/balances', 'Balances and payouts'], ['/publisher/games', 'My games'], ['/publisher/conventions', 'Conventions'], ['/publisher/agreements', 'Agreements and paperwork']],
  admin: [['/admin', 'Overview'], ['/admin/games', 'Games'], ['/admin/publishers', 'Publishers'], ['/admin/money', 'Money'], ['/admin/orders', 'Orders']],
};

export function homeFor(role) { return ROLE_HOME[role] || '/account/family'; }
export const money = n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const date = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
