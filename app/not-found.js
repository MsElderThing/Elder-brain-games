import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="content gutter">
      <div className="wrap lost">
        <img src="/img/detail-boxes.jpg" alt="" />
        <h1>That page rolled a one.</h1>
        <p className="lede">It isn't here. The catalog is, though.</p>
        <Link href="/catalog" className="btn">Back to the shop</Link>
      </div>
    </main>
  );
}
