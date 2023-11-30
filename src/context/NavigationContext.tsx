import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ProgressContext = createContext({
  isProgressing: false,
  setIsProgressing: (isProgressing: boolean) => {},
});

export const ProgressProvider = ({ children }: PropsWithChildren) => {
  const [isProgressing, setIsProgressing] = useState(false);

  useEffect(() => {
    setIsProgressing(false);
    console.log('isProgressing', isProgressing);
  }, []);

  return (
    <ProgressContext.Provider value={{ isProgressing, setIsProgressing }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);

  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
};
