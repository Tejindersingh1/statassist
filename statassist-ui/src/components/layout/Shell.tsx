import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </>
  );
}

