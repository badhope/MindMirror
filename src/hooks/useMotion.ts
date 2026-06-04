/**
 * Accessibility + viewport hooks that drive the animation system.
 *
 *  - ``useReducedMotion``  — wraps framer-motion's primitive and falls
 *                            back to ``false`` if the user has not
 *                            expressed a preference, so animations run
 *                            by default (matches product intent).
 *  - ``useInView``        — IntersectionObserver wrapper that fires
 *                            ``true`` the first time the element is
 *                            scrolled into view. Used by the
 *                            ``FadeInOnView`` component to make long
 *                            pages feel alive without firing every
 *                            animation on mount.
 *  - ``useDelayedReveal`` — returns ``false`` for the first
 *                            ``delay`` ms after mount, then ``true``.
 *                            Used to make data pages show a skeleton
 *                            for a moment so the page transition
 *                            reads as a real "loading" beat (mobile
 *                            app feel) instead of a synchronous
 *                            paint. Honours reduced motion — returns
 *                            ``true`` immediately when the user
 *                            prefers no motion.
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

// Re-export with our default behaviour (assume motion is fine when
// the OS hasn't said otherwise).
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

export function useDelayedReveal(delay = 600): boolean {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(reduce);
  useEffect(() => {
    if (reduce) {
      setReady(true);
      return;
    }
    const id = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(id);
  }, [reduce, delay]);
  return ready;
}

export function useInView<T extends Element = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  /** If true, the observer fires only once and then disconnects. */
  once = true
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return [ref, inView];
}
