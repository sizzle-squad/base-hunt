'use client';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

const MobileContext = createContext({
  isMobile: false,
});

export const MobileProvider = ({ children }: PropsWithChildren) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple user-agent check (we might want to use a more robust method - open to suggestions)
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setIsMobile(mobile);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileCheck = () => {
  const context = useContext(MobileContext);

  if (context === undefined) {
    throw new Error('useMobileCheck must be used within a MobileProvider');
  }

  return context.isMobile;
};
