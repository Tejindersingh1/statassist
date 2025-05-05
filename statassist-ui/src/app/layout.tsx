import './globals.css';
import { Inter } from 'next/font/google';
import Shell from '@/components/layout/Shell';

// ⬇️ import the client-side checker
import A11yDevCheck from '@/components/dev/A11yDevCheck';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Stat‑Assist' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Renders header + main + footer */}
        <Shell>{children}</Shell>

        {/* Only inserts the checker in development */}
        {process.env.NODE_ENV !== 'production' && <A11yDevCheck />}
      </body>
    </html>
  );
}


