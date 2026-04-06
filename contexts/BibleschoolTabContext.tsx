import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

type BibleschoolTab = 'index' | 'modules' | 'voortgang';
export type NavigationDirection = 'left' | 'right';

interface BibleschoolTabContextValue {
  activeTab: BibleschoolTab;
  setActiveTab: (tab: BibleschoolTab) => void;
  navigationDirection: NavigationDirection;
  setNavigationDirection: (direction: NavigationDirection) => void;
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
  const [navigationDirection, setNavigationDirectionState] = useState<NavigationDirection>('right');

  const setActiveTab = useCallback((tab: BibleschoolTab) => {
    setActiveTabState(tab);
  }, []);

  const setNavigationDirection = useCallback((direction: NavigationDirection) => {
    setNavigationDirectionState(direction);
  }, []);

  return (
    <BibleschoolTabContext.Provider value={{ activeTab, setActiveTab, navigationDirection, setNavigationDirection }}>
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
