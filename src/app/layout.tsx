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
      className={`h-full scroll-smooth dark ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="friend"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  var theme = localStorage.getItem('internshield_ui_theme') || 'friend';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col antialiased selection:bg-cyan-500/30 selection:text-slate-100`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
