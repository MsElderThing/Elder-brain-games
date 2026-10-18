'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/Toast';
import Art from '@/components/Art';

const GRADE_BANDS = ['Grades K to 3', 'Grades 4 to 8', 'Grades 6 to 12'];
const SUBJECTS = ['Math', 'ELA', 'STEM', 'Social studies', 'SEL', 'Kits'];
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const parseAges = s => { const m = String(s || '').match(/(\d+)\D+(\d+)?/); return m ? [Number(m[1]), m[2] ? Number(m[2]) : 18] : [8, 12]; };

export default function GameEditor({ game, fromApplication: app, publishers }) {
  const router = useRouter();
  const [open, setOpen] = useState(!game);
  const [busy, setBusy] = useState(false);
  const [ages] = useState(app ? parseAges(app.ages) : null);
  const [f, setF] = useState(game ? { ...game, subjects: game.subjects || [], grade_bands: game.grade_bands || [], panel_notes: game.panel_notes || [] } : {
    title: app?.game_title || '', teaches: app?.teaches || '', description: '', msrp: app?.msrp || '', wholesale_price: '',
    age_min: ages ? ages[0] : 8, age_max: ages ? ages[1] : 12, play_minutes: 30, players_min: 2, players_max: 4,
    subjects: [], grade_bands: [], is_kit: false, approved: false, score: '', stock_on_hand: 0, dropship_available: true,
    publisher_id: app?.publisher_id || '', application_id: app?.id || null, art_url: '', panel_notes: [],
  });
  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const toggleIn = (k, v) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] });

  async function save(extra = {}) {
    setBusy(true);
    const supabase = createClient();
    const row = {
      title: f.title, slug: f.slug || slugify(f.title), teaches: f.teaches, description: f.description || null,
      msrp: Number(f.msrp) || 0, wholesale_price: f.wholesale_price ? Number(f.wholesale_price) : null,
      age_min: Number(f.age_min), age_max: Number(f.age_max), play_minutes: Number(f.play_minutes), players_min: Number(f.players_min), players_max: Number(f.players_max),
      subjects: f.subjects, grade_bands: f.grade_bands, is_kit: !!f.is_kit, score: f.score ? Number(f.score) : null,
      stock_on_hand: Number(f.stock_on_hand) || 0, dropship_available: !!f.dropship_available,
      publisher_id: f.publisher_id || null, application_id: f.application_id || null, art_url: f.art_url || null, panel_notes: f.panel_notes,
      approved: !!f.approved, ...extra,
    };
    const q = game ? supabase.from('games').update(row).eq('id', game.id) : supabase.from('games').insert(row);
    const { error } = await q;
    setBusy(false);
    if (error) return toast(error.message);
    toast(game ? 'Saved' : 'Listing created'); router.refresh(); if (!game) setOpen(false);
  }
  async function remove() {
    if (!game) return;
    setBusy(true);
    const { error } = await createClient().from('games').delete().eq('id', game.id);
    setBusy(false);
    if (error) return toast(error.message);
    toast('Deleted'); router.refresh();
  }
  async function upload(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    const supabase = createClient();
    const path = `${slugify(f.title || 'game')}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('art').upload(path, file, { upsert: true });
    if (error) { setBusy(false); return toast(error.message); }
    const { data } = supabase.storage.from('art').getPublicUrl(path);
    setF({ ...f, art_url: data.publicUrl }); setBusy(false); toast('Art uploaded. Save to keep it.');
  }
  const notes = f.panel_notes;
  const setNote = (i, k, v) => setF({ ...f, panel_notes: notes.map((n, j) => j === i ? { ...n, [k]: v } : n) });

  return (
    <div className={'panel' + (game && !game.approved ? ' muted' : '')} style={{ marginBottom: 12 }}>
      <header>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {game && <div style={{ width: 54 }}><Art game={game} /></div>}
          <div><h3>{f.title || (app ? app.game_title : 'New game')}</h3>
            <span className="note">{game ? (game.approved ? 'Live in the shop' : 'Draft, not shown') : app ? `From ${app.publishers?.orgs?.name || 'a publisher'}'s application` : 'Not saved yet'}</span></div>
        </div>
        <div className="actions">
          {game && <button className="btn sm ghost" onClick={() => save({ approved: !game.approved })} disabled={busy}>{game.approved ? 'Take off shop' : 'Approve and show'}</button>}
          <button className="btn sm ghost" onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Edit'}</button>
        </div>
      </header>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="rowform">
            <div className="field wide"><label>Title</label><input value={f.title} onChange={set('title')} /></div>
            <div className="field wide"><label>Publisher</label><select value={f.publisher_id || ''} onChange={set('publisher_id')}><option value="">(none)</option>{publishers.map(p => <option key={p.id} value={p.id}>{p.orgs?.name}</option>)}</select></div>
            <div className="field"><label>MSRP</label><input value={f.msrp} onChange={set('msrp')} /></div>
            <div className="field"><label>Wholesale</label><input value={f.wholesale_price || ''} onChange={set('wholesale_price')} /></div>
          </div>
          <div className="field"><label>What it teaches (one line)</label><input value={f.teaches} onChange={set('teaches')} /></div>
          <div className="field"><label>Description (your words, for the product page)</label><textarea rows={3} value={f.description || ''} onChange={set('description')} /></div>
          <div className="rowform">
            <div className="field"><label>Age min</label><input type="number" value={f.age_min} onChange={set('age_min')} /></div>
            <div className="field"><label>Age max (18 = and up)</label><input type="number" value={f.age_max} onChange={set('age_max')} /></div>
            <div className="field"><label>Minutes</label><input type="number" value={f.play_minutes} onChange={set('play_minutes')} /></div>
            <div className="field"><label>Players min</label><input type="number" value={f.players_min} onChange={set('players_min')} /></div>
            <div className="field"><label>Players max</label><input type="number" value={f.players_max} onChange={set('players_max')} /></div>
            <div className="field"><label>Panel score / 25</label><input type="number" value={f.score || ''} onChange={set('score')} /></div>
            <div className="field"><label>Stock on hand</label><input type="number" value={f.stock_on_hand} onChange={set('stock_on_hand')} /></div>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <div><label>Grade bands</label><div className="actions">{GRADE_BANDS.map(b => <label key={b} className="check"><input type="checkbox" checked={f.grade_bands.includes(b)} onChange={() => toggleIn('grade_bands', b)} />{b.replace('Grades ', '')}</label>)}</div></div>
            <div><label>Subjects</label><div className="actions">{SUBJECTS.map(b => <label key={b} className="check"><input type="checkbox" checked={f.subjects.includes(b)} onChange={() => toggleIn('subjects', b)} />{b}</label>)}</div></div>
            <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!f.is_kit} onChange={set('is_kit')} />Classroom kit</label>
            <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!f.dropship_available} onChange={set('dropship_available')} />Publisher drop ships</label>
          </div>
          <div className="rowform">
            <div className="field wide"><label>Box art (upload a JPG or PNG, 4:5 works best)</label><input type="file" accept="image/*" onChange={upload} /></div>
            <div className="field wide"><label>or paste an image URL</label><input value={f.art_url || ''} onChange={set('art_url')} /></div>
          </div>
          <div>
            <label>Kid panel quotes (shown on the product page)</label>
            {notes.map((n, i) => (
              <div className="rowform" key={i} style={{ marginBottom: 6 }}>
                <div className="field"><input placeholder="Name" value={n.name || ''} onChange={e => setNote(i, 'name', e.target.value)} /></div>
                <div className="field"><input placeholder="Age" value={n.age || ''} onChange={e => setNote(i, 'age', e.target.value)} /></div>
                <div className="field wide"><input placeholder="What they said" value={n.quote || ''} onChange={e => setNote(i, 'quote', e.target.value)} /></div>
                <button className="btn sm ghost" onClick={() => setF({ ...f, panel_notes: notes.filter((_, j) => j !== i) })}>Remove</button>
              </div>
            ))}
            <button className="btn sm ghost" onClick={() => setF({ ...f, panel_notes: [...notes, { name: '', age: '', quote: '' }] })}>Add a quote</button>
          </div>
          <div className="actions" style={{ justifyContent: 'space-between' }}>
            <div className="actions">
              <button className="btn" onClick={() => save()} disabled={busy}>{game ? 'Save' : 'Create listing'}</button>
              {!game && <button className="btn ghost" onClick={() => save({ approved: true })} disabled={busy}>Create and approve</button>}
            </div>
            {game && <button className="btn sm ghost" onClick={remove} disabled={busy} style={{ color: 'var(--bad)' }}>Delete listing</button>}
          </div>
        </div>
      )}
    </div>
  );
}
