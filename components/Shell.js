'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROLE_NAV, ROLE_LABEL } from '@/lib/roles';
import { createClient } from '@/lib/supabase/client';
import CartButton from '@/components/CartButton';
import { ToastHost } from '@/components/Toast';

const PUBLIC = [['/', 'Home'], ['/catalog', 'Catalog'], ['/publishers', 'For publishers']];

export default function Shell({ profile, children }) {
  const path = usePathname();
  const router = useRouter();
  const role = profile?.role;
  const roleNav = role ? ROLE_NAV[role] || [] : [];

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  const Nav = ({ withHeads }) => (
    <>
      {role && withHeads && <div className="navhead">{role === 'publisher' ? 'Publisher' : role === 'admin' ? 'Staff' : 'Your account'}</div>}
      {roleNav.map(([href, label]) => (
        <Link key={href} href={href} className={path === href ? 'on' : ''}><span className="dot"></span>{label}</Link>
      ))}
      {role && withHeads && <div className="navhead">Site</div>}
      {PUBLIC.map(([href, label]) => (
        <Link key={href} href={href} className={path === href ? 'on' : ''}><span className="dot"></span>{label}</Link>
      ))}
      {!role && <Link href="/signin" className={path === '/signin' ? 'on' : ''}><span className="dot"></span>Sign in</Link>}
    </>
  );

  return (
    <div className="shell">
      <aside className="rail">
        <Link href="/"><img src="/logo.jpg" alt="Elder Brain Games" /></Link>
        <nav className="nav"><Nav withHeads /></nav>
        <div className="who">
          {profile ? (
            <>
              <b>{profile.orgs?.name || profile.full_name || profile.email}</b>
              {ROLE_LABEL[role]}{profile.orgs?.name && profile.full_name ? ` · ${profile.full_name}` : ''}<br />
              <button className="btnlink" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <b>Not signed in</b>
              <Link href="/signin" className="btnlink">Sign in</Link> · <Link href="/signup" className="btnlink">Create account</Link>
            </>
          )}
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <Link href="/" style={{ flex: 'none' }}><img src="/logo.jpg" alt="Elder Brain Games" /></Link>
          <nav className="nav"><Nav /></nav>
          {profile && <button className="btnlink" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }} onClick={signOut}>Sign out</button>}
        </div>
        <div className="wrap">{children}</div>
      </main>
      <CartButton />
      <ToastHost />
    </div>
  );
}
