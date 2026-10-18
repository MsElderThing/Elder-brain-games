'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROLE_NAV, ROLE_LABEL } from '@/lib/roles';
import { createClient } from '@/lib/supabase/client';

const NAV = [['/catalog', 'Shop by grade'], ['/catalog?f=Kits', 'Kits'], ['/for-schools', 'For schools'], ['/publishers', 'For publishers']];

export default function Header({ profile }) {
  const path = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const role = profile?.role;
  async function signOut() { await createClient().auth.signOut(); router.push('/'); router.refresh(); }
  const isOn = href => href.split('?')[0] === path && (href.includes('?') ? false : true);
  return (
    <>
      <header className="hdr gutter">
        <div className="row wrap">
          <Link href="/" className="brand"><img src="/logo.jpg" alt="Elder Brain Games" /></Link>
          <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
            {NAV.map(([h, l]) => <Link key={h} href={h} className={isOn(h) ? 'on' : ''}>{l}</Link>)}
            {role && <Link href={ROLE_NAV[role][0][0]} className="on" style={{ color: 'var(--moss-b)' }}>My account</Link>}
            {!role && <Link href="/signin">Sign in</Link>}
          </nav>
          <div className="right">
            {profile ? (
              <><span className="who"><b>{profile.orgs?.name || profile.full_name}</b> · {ROLE_LABEL[role]}</span><button className="btnlink" onClick={signOut}>Sign out</button></>
            ) : (
              <Link href="/signup" className="btn sm" style={{ boxShadow: '2px 2px 0 var(--moss-d)', borderColor: 'var(--moss-d)' }}>Create account</Link>
            )}
            <button className="burger" aria-label="Menu" onClick={() => setOpen(o => !o)}>Menu</button>
          </div>
        </div>
      </header>
      {role && (ROLE_NAV[role] || []).length > 1 && (
        <div className="subnav gutter"><div className="row wrap">
          <span className="lab">{role === 'publisher' ? 'Publisher' : role === 'admin' ? 'Staff' : 'Your account'}</span>
          {ROLE_NAV[role].map(([h, l]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{l}</Link>)}
        </div></div>
      )}
    </>
  );
}
