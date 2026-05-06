import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PremiumRevealProps {
  children: ReactNode;
  /** optional delay in seconds */
  delay?: number;
}

export const PremiumReveal = ({ children, delay = 0 }: PremiumRevealProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
    style={{ willChange: 'transform, opacity, filter' }}
  >
    {children}
  </motion.div>
);
