import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

type BibleschoolTab = 'index' | 'modules';

interface BibleschoolTabContextValue {
  activeTab: BibleschoolTab;
  setActiveTab: (tab: BibleschoolTab) => void;
}

const BibleschoolTabContext = createContext<
  BibleschoolTabContextValue | undefined
>(undefined);

export function BibleschoolTabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTabState] = useState<BibleschoolTab>('index');
  const setActiveTab = useCallback((tab: BibleschoolTab) => {
    setActiveTabState(tab);
  }, []);

  return (
    <BibleschoolTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </BibleschoolTabContext.Provider>
  );
}

export function useBibleschoolTab() {
  const ctx = useContext(BibleschoolTabContext);
  if (!ctx) {
    throw new Error(
      'useBibleschoolTab must be used within BibleschoolTabProvider'
    );
  }
  return ctx;
}
