import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FullGallery from "./pages/FullGallery";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] bg-ink flex items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 0.9 }}
              className="font-display text-2xl text-bone"
            >
              BASHAASHAA
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <span className="spine-text font-mono text-[10px] text-smoke/60">
          BASHAASHAA / VOL. 01
        </span>
      </div>

      {!loading && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<FullGallery />} />
        </Routes>
      )}

    </BrowserRouter>
  );
}