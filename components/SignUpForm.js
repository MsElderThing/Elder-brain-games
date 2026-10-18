'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-actions';
import { homeFor } from '@/lib/roles';

const HINT = {
  teacher: "You'll get quote pricing, lesson plans, and PD credit. Your office approves quotes from a link.",
  district: "You'll see every quote your staff request, approve them, enter PO numbers, and pay invoices net 30.",
  nonprofit: 'Lending library boxes, program sessions, and grant-ready quotes. Upload your tax-exempt letter after sign-up.',
  individual: 'Card checkout, co-op group orders, and homeschool lesson plans for every game you own.',
};

export default function SignUpForm({ initialRole = 'teacher', next, note }) {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [f, setF] = useState({ fullName: '', orgName: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [confirm, setConfirm] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await signUp({ ...f, role });
    setBusy(false);
    if (r.error) return setErr(r.error);
    if (r.needsConfirm) return setConfirm(true);
    router.push(next || homeFor(role)); router.refresh();
  }
  if (confirm) return <div className="ok-msg">Check your email for a confirmation link, then sign in.</div>;
  return (
    <>
      {note && <p className="note">{note}</p>}
      <div className="roles" style={{ margin: '12px 0' }}>
        {[['teacher', 'Teacher', 'I buy for my classroom'], ['district', 'District or school', 'I approve POs and pay invoices'], ['nonprofit', 'Library or non-profit', 'Programs, lending, grants'], ['individual', 'Family or co-op', 'I pay by card']].map(([r, b, s]) => (
          <div key={r} className={'role' + (role === r ? ' on' : '')} onClick={() => setRole(r)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setRole(r)}><b>{b}</b><span>{s}</span></div>
        ))}
      </div>
      <form className="form" onSubmit={submit}>
        {err && <div className="full err">{err}</div>}
        <div className="field"><label htmlFor="a_name">Your name</label><input id="a_name" value={f.fullName} onChange={set('fullName')} required /></div>
        <div className="field"><label htmlFor="a_org">School or organization</label><input id="a_org" value={f.orgName} onChange={set('orgName')} placeholder={role === 'individual' ? 'Optional' : ''} required={role !== 'individual'} /></div>
        <div className="field full"><label htmlFor="a_email">Email</label><input id="a_email" type="email" value={f.email} onChange={set('email')} required /></div>
        <div className="field full"><label htmlFor="a_pw">Password</label><input id="a_pw" type="password" minLength={8} value={f.password} onChange={set('password')} required /></div>
        <div className="full note">{HINT[role]}</div>
        <div className="full"><button className="btn" type="submit" disabled={busy}>{busy ? 'Creating' : 'Create account'}</button></div>
      </form>
    </>
  );
}
