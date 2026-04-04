"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Ritardo in ms dopo l’intersezione (effetto a cascata sulle griglie) */
  delayMs?: number;
};

export function ScrollReveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties = visible
    ? { transitionDelay: `${delayMs}ms` }
    : { transitionDelay: "0ms" };

  return (
    <div
      ref={ref}
      style={style}
      className={`will-change-transform ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0 sm:translate-y-14"
      } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className} transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
    >
      {children}
    </div>
  );
}
