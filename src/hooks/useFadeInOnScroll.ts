import { useEffect, useRef, useState } from 'react';

interface UseFadeInOptions {
  threshold?: number;
  rootMargin?: string;
  initialDelayMs?: number;
}

export function useFadeInOnScroll(options?: UseFadeInOptions) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (options?.initialDelayMs) {
              timer = setTimeout(() => {
                setIsVisible(true);
              }, options.initialDelayMs);
            } else {
              setIsVisible(true);
            }

            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.08,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (el) observer.unobserve(el);
    };
  }, [options?.threshold, options?.rootMargin, options?.initialDelayMs]);

  return { ref, isVisible };
}
