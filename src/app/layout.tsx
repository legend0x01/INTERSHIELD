import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-ui' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'InternShield - AI Internship Scam Verification Platform',
  description:
    'Free AI-assisted safety platform helping college students detect internship scams, fake offer letters, and extortion schemes before applying or paying.',
  keywords: [
    'internship scam checker',
    'verify internship offer',
    'fake offer letter detection',
    'student fraud prevention',
    'internship safety'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Apply the saved light/dark choice before first paint (no flash).
            Light is the default; dark only when the visitor chose it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = localStorage.getItem('internshield_theme') === 'dark';
                  document.documentElement.classList.toggle('dark', dark);
                  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/60 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-500 selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
