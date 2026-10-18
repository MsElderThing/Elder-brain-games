'use client';
import { useEffect, useState } from 'react';

export function toast(msg) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ebg-toast', { detail: msg }));
}

export function ToastHost() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    let h;
    const on = e => { setMsg(e.detail); setShow(true); clearTimeout(h); h = setTimeout(() => setShow(false), 2600); };
    window.addEventListener('ebg-toast', on);
    return () => window.removeEventListener('ebg-toast', on);
  }, []);
  return <div className={'toast' + (show ? ' show' : '')} role="status">{msg}</div>;
}
