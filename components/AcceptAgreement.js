'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';

export default function AcceptAgreement({ publisherId, versionId, version }) {
  const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false); const router = useRouter();
  async function go() {
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('agreement_acceptances').insert({ publisher_id: publisherId, version_id: versionId, accepted_by: user.id });
    setBusy(false);
    if (error) return toast(error.message);
    toast(`Agreement v${version} accepted`); router.refresh();
  }
  return (
    <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}><input type="checkbox" style={{ width: 'auto' }} checked={ok} onChange={e => setOk(e.target.checked)} id="agree" />I have read and agree to version {version}</label>
      <button className="btn" disabled={!ok || busy} onClick={go}>Accept agreement</button>
    </div>
  );
}
