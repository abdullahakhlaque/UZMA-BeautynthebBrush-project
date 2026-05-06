import React from 'react';
import { motion, Variants } from 'framer-motion';

interface StaggerTextProps {
  text: string;
  className?: string;
  splitBy?: 'word' | 'char';
  as?: React.ElementType;
}

export const StaggerText = ({ text, className, splitBy = 'word', as: Tag = 'p' }: StaggerTextProps) => {
  const items = splitBy === 'char' ? text.split('') : text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionContainer = motion(Tag as any);

  return (
    <MotionContainer
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={childVariants}
          style={{
            display: 'inline-block',
            marginRight: splitBy === 'word' ? '0.25em' : '0',
          }}
        >
          {item}
        </motion.span>
      ))}
    </MotionContainer>
  );
};
