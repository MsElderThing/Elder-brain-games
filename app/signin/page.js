'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth-actions';
import { homeFor } from '@/lib/roles';

function Form() {
  const router = useRouter(); const sp = useSearchParams();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await signIn({ email, password: pw });
    setBusy(false);
    if (r.error) return setErr(r.error);
    router.push(sp.get('next') || homeFor(r.role)); router.refresh();
  }
  return (
    <form className="form" onSubmit={submit}>
      {err && <div className="full err">{err}</div>}
      <div className="field full"><label htmlFor="l1">Email</label><input id="l1" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div className="field full"><label htmlFor="l2">Password</label><input id="l2" type="password" value={pw} onChange={e => setPw(e.target.value)} required /></div>
      <div className="full"><button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</button> <Link href="/signup" className="btn ghost">Create an account</Link></div>
    </form>
  );
}

export default function SignIn() {
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Sign in</div><h1>Welcome back</h1></div>
      <div className="grid2">
        <div className="panel"><header><h2>Sign in</h2></header><Suspense><Form /></Suspense></div>
        <div className="panel"><header><h2>New here?</h2></header>
          <p className="note">Teachers, districts, libraries, and families create an account to check out and see their dashboard. Publishers start on the publisher page.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}><Link href="/signup" className="btn">Create an account</Link><Link href="/publishers" className="btn ghost">I'm a publisher</Link></div></div>
      </div>
    </div></main>
  );
}
