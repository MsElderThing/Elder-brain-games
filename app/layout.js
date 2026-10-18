import './globals.css';
import Shell from '@/components/Shell';
import { getSession } from '@/lib/supabase/server';

export const metadata = {
  title: { default: 'Elder Brain Games', template: '%s · Elder Brain Games' },
  description: 'Tabletop games for classrooms, libraries, and homeschool co-ops. Kid tested, teacher approved.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/icon.png' },
};
export const viewport = { themeColor: '#070807', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const { profile } = await getSession();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap" />
      </head>
      <body>
        <Shell profile={profile}>{children}</Shell>
      </body>
    </html>
  );
}
