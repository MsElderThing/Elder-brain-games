import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="ftr gutter">
      <div className="row wrap">
        <img className="us" src="/img/about.jpg" alt="Alex and Curtis" />
        <div>
          <h3 style={{ color: 'var(--bone)' }}>Two people, one kitchen table, a lot of games.</h3>
          <p>We're Alex and Curtis. We homeschool, we run tabletop games for anyone who'll sit down, and we got tired of teachers having to guess which games would actually work in a classroom. So we play them first, our kids score them, and we ship the ones that earn it with a lesson plan. Niles, Michigan.</p>
          <p className="small">hello@elderbraingames.com · Purchase orders welcome · Net 30 for schools · W-9 on request</p>
          <ul className="small">
            <li><Link href="/for-schools">How quotes and POs work</Link></li>
            <li><Link href="/publishers">Bring us your game</Link></li>
            <li><Link href="/catalog">Catalog</Link></li>
          </ul>
        </div>
        <img className="mark" src="/logo.jpg" alt="" />
      </div>
    </footer>
  );
}
