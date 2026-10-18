// Box art if the publisher has supplied it; otherwise a plain brand card, never a fake box.
export default function Art({ game, className }) {
  if (game.art_url) return <img src={game.art_url} alt={game.title} className={className} />;
  return (
    <div className={'art-missing ' + (className || '')} aria-label={game.title}>
      <span>{game.title}</span>
      <small>Box art coming</small>
    </div>
  );
}
