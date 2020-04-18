import { useEffect, useState } from 'react';

function useWindowSize() {
  const isWindowClient = typeof window === 'object';

  const [windowSize, setWindowSize] = useState(isWindowClient ? window.innerWidth : undefined);

  useEffect(() => {
    function setSize() {
      setWindowSize(window.innerWidth);
    }
    if (isWindowClient) {
      window.addEventListener('beforeprint', setSize);
      window.addEventListener('resize', setSize);
      return () => {
        window.removeEventListener('beforeprint', setSize);
        window.removeEventListener('resize', setSize);
      };
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
}

export default useWindowSize;
