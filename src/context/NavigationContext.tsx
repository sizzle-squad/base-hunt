import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ProgressContext = createContext({
  progress: 0,
  setProgress: (progress: number) => {},
  startProgress: () => {},
});

export const ProgressProvider = ({ children }: PropsWithChildren) => {
  // const [isProgressing, setIsProgressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   setProgress(0);
  // }, [pathname, searchParams]);

  const startProgress = () => {
    let progress = 0;
    const interval = 30; // Milliseconds between each increment

    const timer = setInterval(() => {
      progress += 100 / (3000 / interval); // Increment progress

      if (progress >= 100) {
        clearInterval(timer);
        progress = 100; // Ensure progress does not exceed 100
      }

      setProgress(progress); // Update progress state
    }, interval);
  };

  return (
    <ProgressContext.Provider value={{ progress, startProgress, setProgress }}>
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
