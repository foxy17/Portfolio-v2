import React from 'react';
import ProfileCard from '~/components/Cards/ProfileCard';

const TITLES = [
  'Generalist software engineer',
  'Full-stack developer',
  'Cross-stack debugger',
  'The guy who broke prod',
  'The guy who fixed prod',
  'The guy who trained the AI',
  'Ships features end-to-end',
  'Reads SQL plans for fun',
  'TypeScript apologist',
  'Probably refactoring something',
];

const TITLE_DURATION_S = 2.5;
const TOTAL_DURATION_S = TITLE_DURATION_S * TITLES.length; // 25s

export default function Banner() {
  return (
    <main className="flex flex-col justify-center items-start max-w-4xl mx-auto w-full text-dark-grey dark:text-beige">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center content-center mb-16 max-w-4xl w-full">
        <div className="flex flex-col transition-all">
          <h1 className="mb-4 sm:mb-1">Arnav Chauhan</h1>
          <p
            className="font-sans! font-medium! text-lg sm:text-xl mb-6 tracking-wide flex items-baseline"
            aria-label={TITLES[0]}
          >
            <span className="ai-spinner" aria-hidden="true" />
            <span className="ai-title-rotator" aria-hidden="true">
              {TITLES.map((title, i) => (
                <span
                  key={title}
                  className="ai-title-item"
                  style={{
                    animationDelay: `${i * TITLE_DURATION_S}s, 0s`,
                    animationDuration: `${TOTAL_DURATION_S}s, 6s`,
                  }}
                >
                  {title}
                </span>
              ))}
            </span>
            <span className="ai-ellipsis ml-0.5" aria-hidden="true">…</span>
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
