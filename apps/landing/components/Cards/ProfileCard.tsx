'use client'
import React from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type ProfileCard = {
  style?: string;
};

export default function ProfileCard(props: ProfileCard) {
  const { resolvedTheme } = useTheme();
  let src;

  switch (resolvedTheme) {
    case 'light':
      src = '/images/profile-light.png';
      break;
    case 'dark':
      src = '/images/profile-dark.png';
      break;
    default:
      src = '/images/profile-dark.png';
      break;
  }

  return (
    <div
      className={cn(
        'rounded-xl py-3 px-1 bg-flat-purple text-beige ml-4',
        'dark:bg-flat-yellow dark:text-black -rotate-2 drop-shadow-card-dark dark:drop-shadow-card',
        'flex flex-col items-center justify-center border-2 border-black',
        'transform transition duration-500 hover:rotate-0 hover:scale-110',
        props.style,
      )}
    >
      <Image
        alt="Profile"
        src={src}
        quality={75}
        width={176}
        height={171}
        priority={true}
      />
      <p className="text-md select-none">
        Yes, I drink a lot of <br /> coffee.
      </p>
    </div>
  );
}
