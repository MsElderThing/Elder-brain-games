export default function Cover({ game, rotate }) {
  const age = game.age_max >= 18 ? `${game.age_min} and up` : `${game.age_min} to ${game.age_max}`;
  return (
    <div className="cover" style={{ '--c': game.cover_color || '#2f5a2b', '--r': rotate ? rotate + 'deg' : '0deg' }}>
      {game.score >= 20 && <span className="seal">KID<br />TESTED</span>}
      <span className="age">{age}</span>
      <b>{game.title}</b>
    </div>
  );
}
