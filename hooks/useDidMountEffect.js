import { useEffect, useRef } from 'react';

const useDidMountEffect = (func, dep) => {
  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      return;
    }
    func();
  }, dep);
};

export default useDidMountEffect;
