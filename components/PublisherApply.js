'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { signUp } from '@/lib/auth-actions';

export default function PublisherApply({ conventions, signedIn }) {
  const router = useRouter();
  const [f, setF] = useState({ publisher: '', email: '', password: '', website: '', title: '', ages: '10 to 13', time: '20 to 45 min', msrp: '', slot: 'Video call (next 2 weeks)', teaches: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const supabase = createClient();
    let pubId;
    if (!signedIn) {
      const r = await signUp({ email: f.email, password: f.password, fullName: f.publisher, role: 'publisher', orgName: f.publisher, website: f.website });
      if (r.error) { setBusy(false); return setErr(r.error); }
      if (r.needsConfirm) { setBusy(false); return setDone('Account created. Check your email for a confirmation link, then sign in to finish your application.'); }
      const { data: pub } = await supabase.from('publishers').select('id').single();
      pubId = pub?.id;
    } else {
      const { data: pub } = await supabase.from('publishers').select('id').single();
      pubId = pub?.id;
    }
    if (!pubId) { setBusy(false); return setErr('Could not find your publisher record. Please sign in and try again.'); }
    const { error } = await supabase.from('applications').insert({ publisher_id: pubId, game_title: f.title, ages: f.ages, play_time: f.time, msrp: f.msrp ? Number(String(f.msrp).replace(/[^0-9.]/g, '')) : null, teaches: f.teaches, demo_slot: f.slot });
    setBusy(false);
    if (error) return setErr(error.message);
    router.push('/publisher/games'); router.refresh();
  }

  if (done) return <div className="ok-msg">{done}</div>;
  const slots = ['Video call (next 2 weeks)', ...conventions.filter(c => c.demo_slots > 0).map(c => `${c.name}, ${new Date(c.starts_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`), 'Mail a copy'];
  return (
    <form className="form" onSubmit={submit}>
      {err && <div className="full err">{err}</div>}
      {!signedIn && <>
        <div className="field"><label htmlFor="f1">Publisher or designer</label><input id="f1" value={f.publisher} onChange={set('publisher')} required /></div>
        <div className="field"><label htmlFor="f2">Email</label><input id="f2" type="email" value={f.email} onChange={set('email')} required /></div>
        <div className="field"><label htmlFor="f2b">Password</label><input id="f2b" type="password" minLength={8} value={f.password} onChange={set('password')} required /></div>
        <div className="field"><label htmlFor="f2c">Website or store link</label><input id="f2c" value={f.website} onChange={set('website')} /></div>
      </>}
      <div className="field full"><label htmlFor="f3">Game title</label><input id="f3" value={f.title} onChange={set('title')} required /></div>
      <div className="field"><label htmlFor="f4">Ages</label><select id="f4" value={f.ages} onChange={set('ages')}><option>6 to 8</option><option>8 to 10</option><option>10 to 13</option><option>13 and up</option></select></div>
      <div className="field"><label htmlFor="f5">Play time</label><select id="f5" value={f.time} onChange={set('time')}><option>Under 20 min</option><option>20 to 45 min</option><option>45 min or more</option></select></div>
      <div className="field"><label htmlFor="f6">MSRP</label><input id="f6" value={f.msrp} onChange={set('msrp')} placeholder="$34.99" /></div>
      <div className="field"><label htmlFor="f7">Demo slot</label><select id="f7" value={f.slot} onChange={set('slot')}>{slots.map(s => <option key={s}>{s}</option>)}</select></div>
      <div className="field full"><label htmlFor="f8">What does it teach, and how does a teacher use it?</label><textarea id="f8" rows={3} value={f.teaches} onChange={set('teaches')} /></div>
      <div className="full note">By applying you agree we keep your unreleased game confidential and won't copy or share it. Judging is skill-based against the published scorecard.</div>
      <div className="full"><button className="btn" type="submit" disabled={busy}>{busy ? 'Submitting' : signedIn ? 'Submit application' : 'Create account and submit'}</button></div>
    </form>
  );
}
