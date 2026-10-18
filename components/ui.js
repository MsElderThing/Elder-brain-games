export function Stats({ items }) {
  return <div className="bigs">{items.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>;
}

export function Pill({ kind, children }) { return <span className={'pill' + (kind ? ' ' + kind : '')}>{children}</span>; }

export const STATUS_PILL = {
  cart: ['', 'cart'], quote_sent: ['wait', 'sent to office'], approved: ['ready', 'approved'], po_received: ['wait', 'PO received'],
  paid: ['ok', 'paid'], shipped: ['wait', 'shipped'], delivered: ['ok', 'delivered'], cancelled: ['', 'cancelled'],
  submitted: ['new', 'submitted'], scheduled: ['wait', 'scheduled'], scored: ['wait', 'scored'], accepted: ['ok', 'approved'], declined: ['', 'declined'],
  waiting: ['wait', 'waiting'], ready: ['ready', 'ready'], void: ['', 'void'],
};
export function Status({ s }) { const [k, l] = STATUS_PILL[s] || ['', s]; return <Pill kind={k}>{l}</Pill>; }

export function Empty({ children }) { return <div className="quiet">{children}</div>; }
