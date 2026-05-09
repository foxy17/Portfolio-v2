'use client';

import Image from 'next/image';
import cn from 'classnames';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

type ProjectImage = {
  src: string;
  alt: string;
};

type Props = {
  images: ProjectImage[];
  imageIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
};

export function ProjectImageCarousel({ images, imageIndex, onNext, onPrevious, onSelect }: Props) {
  const activeImage = images[imageIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="mx-auto mb-6 w-full max-w-md overflow-hidden rounded-xl border-2 border-black bg-white dark:border-white dark:bg-dark-grey">
      <div className="relative aspect-[16/10] w-full">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition-opacity duration-300"
          priority
        />
        {hasMultipleImages && (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between">
            <button
              type="button"
              onClick={onPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-beige text-black transition hover:-translate-y-0.5 dark:border-white dark:bg-dark-black dark:text-white"
              aria-label="Previous project image"
            >
              <FiArrowLeft />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-beige text-black transition hover:-translate-y-0.5 dark:border-white dark:bg-dark-black dark:text-white"
              aria-label="Next project image"
            >
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
      {hasMultipleImages && (
        <div className="flex items-center justify-center gap-2 border-t-2 border-black px-4 py-3 dark:border-white">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                'h-2.5 rounded-full transition-all',
                index === imageIndex
                  ? 'w-8 bg-flat-purple dark:bg-flat-yellow'
                  : 'w-2.5 bg-gray-300 dark:bg-gray-600',
              )}
              aria-label={`Show project image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
