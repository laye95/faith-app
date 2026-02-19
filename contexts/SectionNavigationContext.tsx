import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname } from 'expo-router';

interface SectionNavigationContextValue {
  isNavigating: boolean;
  targetSection: string | null;
  startSectionNavigation: (sectionName: string) => void;
}

const SectionNavigationContext = createContext<
  SectionNavigationContextValue | undefined
>(undefined);

export function SectionNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const pathname = usePathname();

  const startSectionNavigation = useCallback((sectionName: string) => {
    setTargetSection(sectionName);
    setIsNavigating(true);
  }, []);

  useEffect(() => {
    if (!isNavigating || !targetSection) return;
    const segments = pathname.split('/').filter((s) => s && s !== '(main)');
    const currentSection = segments[segments.length - 1] ?? 'index';
    const arrived =
      targetSection === 'index'
        ? currentSection === 'index' || segments.length <= 1
        : currentSection === targetSection || pathname.includes(targetSection);
    if (arrived) {
      setIsNavigating(false);
      setTargetSection(null);
    }
  }, [pathname, isNavigating, targetSection]);

  useEffect(() => {
    if (!isNavigating || !targetSection) return;
    const fallback = setTimeout(() => {
      setIsNavigating(false);
      setTargetSection(null);
    }, 2000);
    return () => clearTimeout(fallback);
  }, [isNavigating, targetSection]);

  return (
    <SectionNavigationContext.Provider
      value={{ isNavigating, targetSection, startSectionNavigation }}
    >
      {children}
    </SectionNavigationContext.Provider>
  );
}

export function useSectionNavigation() {
  const ctx = useContext(SectionNavigationContext);
  if (!ctx) {
    throw new Error(
      'useSectionNavigation must be used within SectionNavigationProvider'
    );
  }
  return ctx;
}
