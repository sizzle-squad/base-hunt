import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [size, setSize] = useState('large');

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth < 600) {
        setSize('small');
      } else if (window.innerWidth >= 600 && window.innerWidth < 1200) {
        setSize('medium');
      } else {
        setSize('large');
      }
    };

    // Check size on mount
    checkSize();

    // Set up event listener
    window.addEventListener('resize', checkSize);

    // Clean up
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return size;
};

export default useScreenSize;
