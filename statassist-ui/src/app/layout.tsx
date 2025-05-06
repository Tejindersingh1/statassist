import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Shell from '@/components/layout/Shell';
import ThemeProvider from '@/components/providers/ThemeProvider';
import A11yDevCheck from '@/components/dev/A11yDevCheck';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Stat‑Assist' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>

        {process.env.NODE_ENV !== 'production' && <A11yDevCheck />}
      </body>
    </html>
  );
}


