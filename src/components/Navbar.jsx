import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrolled from '../hooks/useScrolled';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  const handleNav = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled
          ? 'bg-ink/80 backdrop-blur-md py-4 border-b border-hairline/60'
          : 'bg-transparent py-7'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('#home');
          }}
          className="font-display text-lg md:text-xl tracking-[0.2em] text-bone"
        >
          BASHAASHAA
          <span className="text-smoke font-body text-[10px] align-top ml-1 tracking-widest2">
            STUDIO
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-10 font-body text-xs tracking-[0.2em] uppercase text-bone/90">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="relative pb-1 hover:text-bone transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-bone after:transition-all after:duration-500 hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleNav('#contact')}
          className="hidden md:inline-block border border-bone/70 text-bone text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-bone hover:text-ink transition-colors duration-500"
        >
          Book Now
        </button>

        <button
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 w-8"
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`h-px bg-bone transition-transform duration-300 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px bg-bone transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-px bg-bone transition-transform duration-300 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-ink/95 backdrop-blur-md border-t border-hairline/60"
          >
            <ul className="flex flex-col px-6 py-6 gap-5 font-body text-sm tracking-[0.2em] uppercase text-bone">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('#contact')}
                  className="border border-bone/70 px-6 py-3 w-full text-left"
                >
                  Book Now
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
