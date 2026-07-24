import { motion } from 'framer-motion';

/**
 * Shared scroll-reveal wrapper: fade + slight rise, staggered by `delay`.
 * Keeps reveal timing consistent across sections instead of re-deriving
 * transition values in every component.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.9,
  className = '',
  once = true,
  amount = 0.2,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
