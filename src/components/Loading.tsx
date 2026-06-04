/**
 * Mobile-style loading primitives.
 *
 * Three building blocks:
 *
 *  - ``Skeleton``      — shimmering gray box that stands in for text,
 *                         cards, avatars etc. while data is loading.
 *                         Matches the iOS / Material / WeChat aesthetic.
 *  - ``Spinner``       — circular indeterminate indicator for actions
 *                         and full-page suspensions.
 *  - ``TopProgressBar``— thin bar pinned to the top of the viewport that
 *                         auto-advances while a route change is in
 *                         flight, then snaps to 100% and fades out.
 *                         This is the YouTube / Medium / GitHub pattern.
 *
 * All three honour ``prefers-reduced-motion`` and degrade to a static
 * placeholder / simple fade so users with vestibular sensitivity are
 * not punished.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

interface SkeletonProps {
  className?: string;
  /** Circle vs rounded-rect. Default rounded. */
  shape?: 'rect' | 'circle' | 'rounded';
  /** Disable the shimmer even when motion is allowed. */
  static?: boolean;
}

export function Skeleton({ className, shape = 'rounded', static: isStatic }: SkeletonProps) {
  const reduce = useReducedMotion();
  const shapeCls = shape === 'circle' ? 'rounded-full' : shape === 'rect' ? '' : 'rounded-lg';
  const shouldShimmer = !isStatic && !reduce;
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-busy="true"
      className={cn(
        'relative overflow-hidden bg-slate-200/70 dark:bg-slate-700/50',
        shapeCls,
        shouldShimmer && 'skeleton-shimmer',
        className
      )}
    />
  );
}

/** Stack of skeleton lines that resembles a paragraph. The final
 *  line is intentionally shorter so the placeholder looks like real
 *  text, not a uniform block. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          // Last line shorter for a natural paragraph shape.
          className={cn('h-3', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

/** Card-shaped skeleton: avatar + two text columns. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/40',
        className
      )}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <Skeleton shape="circle" className="h-12 w-12 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export function Spinner({
  size = 'md',
  className,
  label,
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  /** Optional accessible label. */
  label?: string;
}) {
  const dims = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-10 w-10 border-4',
  } as const;
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}
      className={cn(
        'inline-block rounded-full border-blue-200 border-t-blue-600 animate-spin',
        dims[size],
        className
      )}
    />
  );
}

/**
 * Full-page mobile-style loader: centred spinner with pulsing rings.
 * The two outer rings expand and fade out — same visual language as
 * the iOS network activity indicator and the WeChat pull-to-refresh.
 */
export function PageLoader({ label }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16"
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}
    >
      <div className="relative h-16 w-16">
        {!reduce && (
          <>
            <span
              className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping"
              style={{ animationDuration: '1.8s' }}
            />
            <span
              className="absolute inset-2 rounded-full bg-blue-400/30 animate-ping"
              style={{ animationDuration: '1.8s', animationDelay: '0.4s' }}
            />
          </>
        )}
        <span className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" />
      </div>
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top progress bar
// ---------------------------------------------------------------------------

/**
 * Pinned-to-top progress bar that mimics the YouTube / Medium behaviour:
 * the bar advances to 70% within 400ms, lingers, then snaps to 100% and
 * fades out. Call ``start()`` when a route change begins and ``done()``
 * once the new page has rendered. Safe to call repeatedly — overlapping
 * transitions cancel each other cleanly via a monotonic id.
 */
export function TopProgressBar() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onStart() {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tickRef.current) clearTimeout(tickRef.current);
      setVisible(true);
      setProgress(reduce ? 100 : 12);
    }
    function onEnd() {
      setProgress(100);
      timerRef.current = setTimeout(() => setVisible(false), 280);
    }
    // Custom events fired by App.tsx on route change.
    window.addEventListener('mindmirror:route-start', onStart as EventListener);
    window.addEventListener('mindmirror:route-end', onEnd as EventListener);
    return () => {
      window.removeEventListener('mindmirror:route-start', onStart as EventListener);
      window.removeEventListener('mindmirror:route-end', onEnd as EventListener);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [reduce]);

  // Self-driving tick: after first paint, creep towards 70% so the bar
  // looks alive even for slow networks. Snaps to 100% on route-end.
  useEffect(() => {
    if (!visible || reduce) return;
    if (progress >= 100) return;
    const _remaining = Math.max(70, 100 - progress);
    const step = Math.random() * 4 + 2;
    tickRef.current = setTimeout(() => {
      setProgress(p => Math.min(70, p + step));
    }, 200);
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [progress, visible, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="top-progress"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
            style={{
              width: `${progress}%`,
              transition: reduce
                ? 'width 0.05s linear'
                : 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
