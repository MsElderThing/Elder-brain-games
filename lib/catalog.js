export const GRADES = [
  { key: 'Grades K to 3', label: 'K to 3', sub: 'Counting, letters, taking turns', img: '/img/detail-cards.jpg' },
  { key: 'Grades 4 to 8', label: '4 to 8', sub: 'Fractions, maps, ecosystems', img: '/img/detail-board.jpg' },
  { key: 'Grades 6 to 12', label: '6 to 12', sub: 'Storytelling, civics, strategy', img: '/img/detail-boxes.jpg' },
  { key: 'Kits', label: 'Classroom kits', sub: 'Copies for the whole room', img: '/img/kit.jpg' },
  { key: 'Homeschool', label: 'Homeschool', sub: 'Every game, co-op pricing', img: '/img/hero.jpg' },
];
export const SUBJECTS = ['Math', 'ELA', 'STEM', 'Social studies'];

export const ageText = g => (g.age_max >= 18 ? `ages ${g.age_min} and up` : `ages ${g.age_min} to ${g.age_max}`);
export const playersText = g => (g.players_min === 1 ? `up to ${g.players_max}` : `${g.players_min} to ${g.players_max} players`);
export const packedTitle = g => `${g.title} · ${ageText(g)} · ${g.play_minutes} min · ${g.teaches.split(',')[0].split(' + ')[0].toLowerCase()}`;
export const boxArt = g => g.art_url || null;

export function matches(g, f) {
  if (!f || f === 'All' || f === 'Homeschool') return true;
  if (f === 'Kits') return g.is_kit;
  return (g.subjects || []).includes(f) || (g.grade_bands || []).includes(f);
}

export const panelNotes = g => Array.isArray(g.panel_notes) ? g.panel_notes : [];
