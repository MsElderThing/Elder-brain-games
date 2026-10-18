import Link from 'next/link';
import SignUpForm from '@/components/SignUpForm';

export const metadata = { title: 'Create an account' };

export default async function SignUp({ searchParams }) {
  const sp = await searchParams;
  const role = ['teacher', 'district', 'nonprofit', 'individual'].includes(sp?.role) ? sp.role : 'teacher';
  return (
    <section className="page">
      <div><div className="eyebrow">Create an account</div><h1>Tell us who you are</h1><p className="note">We'll set up the right dashboard and checkout for you.</p></div>
      <div className="panel"><SignUpForm initialRole={role} next={sp?.next} /></div>
      <p className="note">Publishing a game? <Link href="/publishers#apply">Create a publisher account instead.</Link> Already have one? <Link href="/signin">Sign in.</Link></p>
    </section>
  );
}
