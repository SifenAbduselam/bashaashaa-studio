import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '../data/photos';

const SLIDE_DURATION = 4000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-ink">
      {/* Slideshow layer */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={heroSlides[index].id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <motion.img
              src={heroSlides[index].image}
              alt={heroSlides[index].caption}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: SLIDE_DURATION / 1000 + 1.6, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/90" />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      {/* Text content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-[11px] md:text-xs tracking-widest2 uppercase text-parchment/80 mb-6"
        >
          Photography &nbsp;•&nbsp; Video Production &nbsp;•&nbsp; Weddings &nbsp;•&nbsp; Events
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-normal text-5xl sm:text-6xl md:text-8xl text-bone leading-[0.95] text-balance"
        >
          Bashaashaa Studio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="font-display italic text-lg md:text-2xl text-smoke mt-6 max-w-xl text-balance"
        >
          Capturing timeless moments that become unforgettable memories.
        </motion.p>

        <motion.a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 inline-block border border-bone/70 text-bone text-xs tracking-[0.25em] uppercase px-9 py-4 hover:bg-bone hover:text-ink transition-colors duration-500"
        >
          Book Your Session
        </motion.a>
      </div>

      {/* Slide progress indicator — a scrubbing line instead of dots */}
      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center gap-2 px-6">
        {heroSlides.map((slide, i) => (
          <div key={slide.id} className="h-px w-12 bg-bone/25 overflow-hidden">
            {i === index && (
              <motion.div
                key={index}
                className="h-full bg-bone"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
              />
            )}
            {i < index && <div className="h-full bg-bone/70 w-full" />}
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-24 md:bottom-8 right-6 md:right-10 z-10 hidden sm:flex flex-col items-center gap-3 text-bone/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-mono text-[10px] tracking-widest2 spine-text">SCROLL</span>
        <span className="w-px h-10 bg-bone/40" />
      </motion.div>
    </section>
  );
}
