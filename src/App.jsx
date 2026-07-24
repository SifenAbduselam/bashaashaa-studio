import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GallerySection from './components/GallerySection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-ink flex items-center justify-center"
          >
            <motion.span
              initial={{ letterSpacing: '0.1em', opacity: 0 }}
              animate={{ letterSpacing: '0.35em', opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-2xl text-bone"
            >
              BASHAASHAA
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magazine-spine index, echoes the signature frame motif at page edges */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <span className="spine-text font-mono text-[10px] text-smoke/60">
          BASHAASHAA / VOL. 01
        </span>
      </div>

      <Navbar />
      <main className="bg-ink">
        <Hero />
        <AboutSection />
        <GallerySection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
