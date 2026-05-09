import { useCallback, useEffect, useRef, useState } from 'react';

export function useProjectModalController<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const activeTriggerRef = useRef<HTMLElement | null>(null);

  const open = (item: T) => {
    activeTriggerRef.current = document.activeElement as HTMLElement | null;
    setImageIndex(0);
    setSelectedItem(item);
  };

  const close = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => {
      setSelectedItem(null);
      activeTriggerRef.current?.focus();
    }, 180);
  }, []);

  useEffect(() => {
    if (!selectedItem) return undefined;

    const showTimer = window.setTimeout(() => setIsVisible(true), 20);
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(showTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, selectedItem]);

  const nextImage = (imagesLength: number) =>
    setImageIndex((i) => (i === imagesLength - 1 ? 0 : i + 1));

  const previousImage = (imagesLength: number) =>
    setImageIndex((i) => (i === 0 ? imagesLength - 1 : i - 1));

  return { selectedItem, isVisible, imageIndex, setImageIndex, open, close, nextImage, previousImage };
}
