import './globals.css';
import { Inter } from 'next/font/google';
import Shell from '@/components/layout/Shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Stat‑Assist' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

