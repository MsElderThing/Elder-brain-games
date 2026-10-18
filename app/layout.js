import './globals.css';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartButton from '@/components/CartButton';
import { ToastHost } from '@/components/Toast';
import { getSession } from '@/lib/supabase/server';

const display = localFont({ src: './fonts/lilita.woff2', variable: '--font-display', display: 'swap' });
const body = localFont({
  src: [
    { path: './fonts/atk-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/atk-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/atk-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/atk-700-italic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-body', display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://elderbraingames.com'),
  title: { default: 'Elder Brain Games', template: '%s · Elder Brain Games' },
  description: 'Tabletop games for classrooms, libraries, and homeschool co-ops. Played by teachers, scored by kids, shipped with a lesson plan.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: { title: 'Elder Brain Games', description: 'Games your students will beg to play again.', images: ['/img/og.png'], siteName: 'Elder Brain Games' },
};
export const viewport = { themeColor: '#131410', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const { profile } = await getSession();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="site">
          <Header profile={profile} />
          {children}
          <Footer />
        </div>
        <CartButton role={profile?.role} />
        <ToastHost />
      </body>
    </html>
  );
}
