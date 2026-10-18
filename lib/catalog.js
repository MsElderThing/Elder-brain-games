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
export const boxArt = g => `/img/box-${g.slug}.jpg`;

export function matches(g, f) {
  if (!f || f === 'All' || f === 'Homeschool') return true;
  if (f === 'Kits') return g.is_kit;
  return (g.subjects || []).includes(f) || (g.grade_bands || []).includes(f);
}

// Sample kid panel comments until real scorecards exist. Keyed by slug.
export const KID_NOTES = {
  'cartographers-apprentice': [['Piper', 10, 'I beat Mom twice and I want to make my own map now.'], ['Scarlette', 12, 'The fractions part sneaks up on you. In a good way.']],
  'ratfolk-bakery': [['Kaia', 2, 'Pointed at the rats and demanded "more bread."'], ['Piper', 10, 'Easy to teach my little sister. She mostly followed the rules.']],
  'the-long-ballad': [['Brynne', 14, 'We argued about the ending for twenty minutes. That is the game working.']],
  'council-of-crows': [['Brynne', 14, 'Negotiation got heated. I would run this in a civics class in a second.']],
  'tidepool-tactics': [['Scarlette', 12, 'Setup is long but once it goes, it goes.']],
};
