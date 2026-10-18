import Link from 'next/link';

export const metadata = { title: 'For schools' };

export default function ForSchools() {
  return (
    <main className="content gutter">
      <div className="wrap section" style={{ maxWidth: 820 }}>
        <div><span className="kicker">For schools, districts, and libraries</span><h1>How buying from us works when the money is school money.</h1>
          <p className="lede" style={{ marginTop: 12 }}>We set this up the way your business office already works, because that is the only way it gets approved.</p></div>

        <div className="flow">
          <div><b>1. Build a quote</b><span>Add games from the catalog. No account needed to browse; one email to save the quote.</span></div>
          <div><b>2. Send it to your office</b><span>The quote PDF has our W-9 attached and is good for 60 days.</span></div>
          <div><b>3. They approve, we ship</b><span>Your office enters the PO number in their account or emails it. We ship within a week.</span></div>
          <div><b>4. Pay net 30</b><span>Invoice follows the shipment. Check or ACH. No card needed.</span></div>
        </div>

        <div className="grid2">
          <div className="panel"><header><h3>Tax exemption</h3></header><p>Send your Michigan Form 3372 (or your state's equivalent) to hello@elderbraingames.com once and we keep it on file. Quotes come out tax-free from then on.</p></div>
          <div className="panel"><header><h3>Vendor paperwork</h3></header><p>W-9 is attached to every quote. Certificate of insurance and vendor registration forms on request; we've filled out enough of them to be quick about it.</p></div>
          <div className="panel"><header><h3>Lesson plans and standards</h3></header><p>Every game ships with a lesson plan mapped to state standards for its grade band. They unlock in the teacher's account the day the order is paid, as PDFs they can print or share.</p></div>
          <div className="panel"><header><h3>Grants and co-ops</h3></header><p>We write quotes in the itemized, outcome-per-title format grant applications ask for. Libraries and non-profits get the same terms as schools.</p></div>
        </div>

        <div className="notecard" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <span className="date">A note for business offices</span>
            <h3>We know this is the part that decides it.</h3>
            <p>Before Elder Brain Games, Alex spent a decade running purchasing and ERP systems for manufacturers. She has approved more POs than she'd like to count. If something in our paperwork doesn't fit your process, email and it will be fixed the same day.</p>
            <p className="sig">hello@elderbraingames.com</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/catalog" className="btn">Start a quote</Link><Link href="/signup?role=district" className="btn ghost">Create a district account</Link></div>
      </div>
    </main>
  );
}
