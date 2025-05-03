export default function SiteFooter() {
  return (
    <footer className="border-t bg-slate-50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 text-sm text-slate-500 md:flex-row md:justify-between">
        <span>© 2025 Stat‑Assist</span>
        <div className="flex gap-4">
          <a href="/privacy">Privacy</a>
          <a href="https://github.com/Errornautical/statassist" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

