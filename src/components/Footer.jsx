export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink border-t border-hairline/60 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-display text-lg tracking-[0.2em] text-bone">
          BASHAASHAA
          <span className="text-smoke font-body text-[10px] align-top ml-1 tracking-widest2">
            STUDIO
          </span>
        </p>
        <p className="font-body text-xs text-smoke text-center">
          &copy; {year} Bashaashaa Studio. All moments reserved.
        </p>
        <div className="flex gap-6 font-mono text-[10px] tracking-widest2 uppercase text-smoke">
          <a href="#home" className="hover:text-bone transition-colors">Home</a>
          <a href="#gallery" className="hover:text-bone transition-colors">Gallery</a>
          <a href="#contact" className="hover:text-bone transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
