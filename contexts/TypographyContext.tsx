import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface TypographyContextType {
  fontFamily: string;
  fontSizeScale: number;
  setFontFamily: (family: string) => void;
  setFontSizeScale: (scale: number) => void;
}

const TypographyContext = createContext<TypographyContextType | undefined>(
  undefined,
);

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [fontFamily, setFontFamilyState] = useState('Poppins_400Regular');
  const [fontSizeScale, setFontSizeScaleState] = useState(1.0);

  const setFontFamily = useCallback((family: string) => {
    setFontFamilyState(family);
  }, []);

  const setFontSizeScale = useCallback((scale: number) => {
    setFontSizeScaleState(scale);
  }, []);

  const value = useMemo(
    () => ({ fontFamily, fontSizeScale, setFontFamily, setFontSizeScale }),
    [fontFamily, fontSizeScale, setFontFamily, setFontSizeScale],
  );

  return (
    <TypographyContext.Provider value={value}>
      {children}
    </TypographyContext.Provider>
  );
}

export function useTypography() {
  const ctx = useContext(TypographyContext);
  if (!ctx) {
    return {
      fontFamily: 'Poppins_400Regular',
      fontSizeScale: 1.0,
      setFontFamily: (_: string) => {},
      setFontSizeScale: (_: number) => {},
    };
  }
  return ctx;
}
