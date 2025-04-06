import { useState, useEffect } from 'react';

interface Options {
  enterDelay?: number;
  exitDelay?: number;
  onUnmount?: () => void;
}

const useDelayedRender = (active: boolean = false, options: Options = {}) => {
  const { enterDelay = 1, exitDelay = 0, onUnmount } = options;
  const [mounted, setMounted] = useState(active);
  const [rendered, setRendered] = useState(active);

  useEffect(() => {
    let renderTimer: NodeJS.Timeout;
    let unmountTimer: NodeJS.Timeout;

    if (active) {
      // Mount immediately
      setMounted(true);
      if (enterDelay <= 0) {
        setRendered(true);
      } else {
        renderTimer = setTimeout(() => setRendered(true), enterDelay);
      }
    } else {
      // Remove rendered immediately
      setRendered(false);
      if (exitDelay <= 0) {
        setMounted(false);
        onUnmount?.();
      } else {
        unmountTimer = setTimeout(() => {
          setMounted(false);
          onUnmount?.();
        }, exitDelay);
      }
    }

    return () => {
      clearTimeout(renderTimer);
      clearTimeout(unmountTimer);
    };
  }, [active, enterDelay, exitDelay, onUnmount]);

  return { mounted, rendered };
};

export default useDelayedRender;