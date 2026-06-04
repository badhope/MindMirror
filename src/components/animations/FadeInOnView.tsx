/**
 * A lightweight wrapper that fades + lifts content into view the first
 * time it scrolls into the viewport. Drops straight to the final state
 * when the user has ``prefers-reduced-motion: reduce``.
 */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useInView, useReducedMotion } from '../../hooks/useMotion';

interface Props {
  children: ReactNode;
  className?: string;
  /** Vertical offset in px. Default 24. */
  y?: number;
  /** Animation duration in seconds. Default 0.5. */
  duration?: number;
  /** Delay in seconds. Default 0. */
  delay?: number;
  /** Tag for the wrapper element. Default 'div'. */
  as?: 'div' | 'section' | 'li' | 'article';
}

export function FadeInOnView({
  children,
  className,
  y = 24,
  duration = 0.5,
  delay = 0,
  as = 'div',
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduce = useReducedMotion();

  const Comp = motion[as] as typeof motion.div;

  if (reduce) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </div>
    );
  }
  return (
    <Comp
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
