import React, { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: any) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface LenisProviderProps {
  children: ReactNode;
  options?: any;
}

export const LenisProvider = ({ children, options = {} }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      ...options,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]);

  const scrollTo = useCallback((target: string | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};
