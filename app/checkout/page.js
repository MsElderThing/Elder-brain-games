import { getSession } from '@/lib/supabase/server';
import SignUpForm from '@/components/SignUpForm';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata = { title: 'Checkout' };

export default async function Checkout() {
  const { profile } = await getSession();
  if (!profile) {
    return (
      <main className="content gutter"><div className="wrap section">
        <div><div className="kicker">Checkout</div><h1>Create an account to check out</h1></div>
        <div className="panel"><SignUpForm next="/checkout" note="Schools, districts, and libraries get a PO-ready quote with our W-9. Families pay by card." /></div>
      </div></main>
    );
  }
  return (
    <main className="content gutter"><div className="wrap section">
      <div><div className="kicker">Checkout</div><h1>{profile.role === 'individual' ? 'Pay by card' : 'Request a quote'}</h1></div>
      <CheckoutForm profile={profile} />
    </div></main>
  );
}
