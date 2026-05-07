import React from 'react';
import ProfileCard from '~/components/Cards/ProfileCard';

export default function Banner() {
  return (
    <main className="flex flex-col justify-center items-start max-w-4xl mx-auto w-full text-dark-grey dark:text-beige">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center content-center mb-16 max-w-4xl w-full">
        <div className="flex flex-col transition-all">
          <h1 className="mb-4 sm:mb-1">Arnav Chauhan</h1>
          <p
            className="font-sans! font-medium! text-lg sm:text-xl mb-6 tracking-wide"
            aria-label="Generalist software engineer"
          >
            <span className="ai-shimmer">Generalist software engineer</span>
            <span className="ai-cursor" aria-hidden="true" />
          </p>
          <p className="text-lg md:text-xl max-w-xl">
            Building software across the stack. Best on problems that don&apos;t
            stay in one layer — the kind where the symptom and the fix
            don&apos;t live in the same service. Mostly worked at startups, on
            teams small enough that the title on paper doesn&apos;t match what
            you do on Tuesday.
          </p>
        </div>

        <ProfileCard style="mb-12 md:mb-0 " />
      </div>
    </main>
  );
}
