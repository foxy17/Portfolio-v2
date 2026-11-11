'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MotionConfig, motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { SnapStop, focusRange, haptic, playTones, usePinnedStrip, useSnapZone } from '~/lib/invite';

const MAPS_URL = 'https://maps.app.goo.gl/DARdzgwTAzPLt2yo7';

const PHOTOS = [
  { src: '/images/engagement/us-5.jpg', caption: 'Bombay nights', alt: 'Aditi and Arnav at a Bombay cafe' },
  { src: '/images/engagement/us-2.jpg', caption: 'Side quest', alt: 'Aditi and Arnav between mossy stone gates on a forest trail' },
];

const display = 'font-[family-name:var(--font-display)]';
const hud = 'font-mono text-xs tabular-nums';
// Unlayered global heading styles require important font and colour overrides.
const heading = 'font-[family-name:var(--font-display)]! font-semibold! tracking-[-0.025em]!';
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4';

// Orange and lilac echo the players’ jackets; sage marks readiness.
const HERO_CSS = `
@supports (animation-timeline: view()) {
  .invite-hero { view-timeline-name: --invite-hero; }
  .invite-hero-players, .invite-hero-footer {
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: --invite-hero;
    animation-range: contain 0% exit 100%;
  }
  .invite-hero-players { animation-name: invite-players; }
  .invite-hero-footer { animation-name: invite-footer; }
}
@keyframes invite-players { 65%, 100% { transform: translateY(-35px); opacity: 0; } }
@keyframes invite-footer { 40%, 100% { transform: translateY(-20px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .invite-hero * { animation: none !important; }
}
`;

function Hero() {
  return (
    <section className="invite-hero relative isolate h-[120svh] overflow-clip" aria-label="Aditi and Arnav's engagement">
      <style>{HERO_CSS}</style>
      <SnapStop top="0" />
      <div className="sticky top-0 flex h-svh min-h-[600px] flex-col bg-[#24252d] px-7 pb-8 pt-7">
        {/* Dota 2 hero-select grid as the crowd of guests (fan art, non-commercial). */}
        <Image src="/images/engagement-2/hero-icons.webp" alt="" fill preload sizes="(max-width: 448px) 100vw, 448px" className="object-cover opacity-45" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#24252d]/50 via-[#24252d]/60 to-[#24252d]/95" />
        <div className={`${hud} relative flex items-center justify-between border-b border-[#f3eddf]/25 pb-4`}>
          <span>ENGAGEMENT / LOBBY</span>
          <span className="text-[#a8c5ad]">02 / 02 READY</span>
        </div>

        <div className="invite-hero-players relative mt-[5svh]">
          <p className="mb-5 text-base text-[#d2cdbf]">Player two. For life.</p>
          <h1 className={`${heading} text-[#f3eddf]!`}>
            <span className="sr-only">Aditi &amp; Arnav</span>
            <span aria-hidden className="relative grid grid-cols-2 gap-4">
              {['Aditi', 'Arnav'].map((name, index) => (
                <span key={name} className={`block min-w-0 ${name === 'Arnav' ? 'text-[#efa16f]' : 'text-[#c4adeb]'}`}>
                  <span className="relative block aspect-[3/4] max-h-[32svh] overflow-hidden border border-current bg-[#282b24]">
                    <Image
                      src={`/images/engagement-2/p-${name.toLowerCase()}.webp`}
                      alt=""
                      fill
                      loading="eager"
                      sizes="(max-width: 448px) 40vw, 188px"
                      className="object-cover object-center"
                    />
                    <span className={`${hud} absolute bottom-0 inset-x-0 flex items-center justify-between bg-[#1b1d19]/95 px-2 py-2 font-normal tracking-normal text-current`}>
                      <span>P0{index + 1}</span><span>READY ✓</span>
                    </span>
                  </span>
                  <span className={`${hud} mt-2 block text-sm font-normal tracking-normal`}>
                    {name.toUpperCase()}
                  </span>
                </span>
              ))}
              <span className="absolute left-1/2 top-[35%] flex h-8 w-8 -translate-x-1/2 items-center justify-center border-2 border-[#c4adeb] border-b-[#efa16f] border-r-[#efa16f] bg-[#24252d] text-xl font-normal text-[#f3eddf]">+</span>
            </span>
          </h1>
          <p className={`${display} mt-5 text-[clamp(3.5rem,17vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-[#f3eddf]`}>
            <span className="text-[#c4adeb]">Aditi</span> &amp; <span className="text-[#efa16f]">Arnav&rsquo;s</span>
            <br />Engagement
          </p>
        </div>

        <div className="invite-hero-footer relative mt-auto border-t border-[#f3eddf]/25 pt-4">
          <time dateTime="2026-12-11" className={`${display} block text-[clamp(3rem,14vw,4rem)] font-semibold leading-none`}>11 DECEMBER 2026</time>
          <div className={`${hud} mt-4 grid grid-cols-2 border-t border-[#f3eddf]/15 pt-3 text-[#b9b9ab]`}>
            <p>SESSION<br /><span className="mt-1 block text-[#f3eddf]">FRIDAY / 10 AM</span></p>
            <p className="border-l border-[#f3eddf]/15 pl-4">REGION<br /><span className="mt-1 block text-[#f3eddf]">MUMBAI</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HighlightPhoto({
  src, caption, alt, index, progress,
}: (typeof PHOTOS)[number] & { index: number; progress: MotionValue<number> }) {
  const [, center, next] = focusRange(index, PHOTOS.length);
  const reducedMotion = useReducedMotion();
  // Function form avoids WAAPI's rejection of focusRange's negative first offset.
  const opacity = useTransform(progress, (p) => reducedMotion ? 1 : 1 - Math.min(Math.abs(p - center) / (next - center), 1) * 0.25);
  const scale = useTransform(progress, (p) => reducedMotion ? 1 : 1 - Math.min(Math.abs(p - center) / (next - center), 1) * 0.06);

  return (
    <motion.figure style={{ opacity, scale }} className="w-[78vw] max-w-[350px] shrink-0 origin-bottom">
      <div className={`${hud} flex items-center justify-between border-b border-[#f3eddf]/25 pb-3 text-[#b9b9ab]`}>
        <span>MEMORY / 0{index + 1}</span><span>DUO ARCHIVE</span>
      </div>
      <div className="relative mt-3 aspect-[4/5] max-h-[50svh] overflow-hidden bg-[#282b24]">
        <Image src={src} alt={alt} fill sizes="(max-width: 448px) 78vw, 350px" className="object-cover" />
      </div>
      <figcaption className="grid grid-cols-[2.5rem_1fr] border-b border-[#f3eddf]/25 py-4">
        <span className={`${hud} pt-1 ${index % 2 === 0 ? 'text-[#c4adeb]' : 'text-[#efa16f]'}`}>0{index + 1}</span>
        <span>
          <span className={`${display} block text-[2rem] font-medium uppercase leading-none ${index % 2 === 0 ? 'text-[#c4adeb]' : 'text-[#efa16f]'}`}>{caption}</span>
          <span className={`${hud} mt-2 block text-[#b9b9ab]`}>ADITI + ARNAV</span>
        </span>
      </figcaption>
    </motion.figure>
  );
}

function Segment({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [, center, next] = focusRange(index, PHOTOS.length);
  const opacity = useTransform(progress, (p) => 1 - Math.min(Math.abs(p - center) / (next - center), 1) * 0.8);
  return <motion.span className={`h-[3px] w-8 ${index % 2 === 0 ? 'bg-[#c4adeb]' : 'bg-[#efa16f]'}`} style={{ opacity }} />;
}

function Highlights() {
  const { sectionRef, trackRef, progress, x, height, stops } = usePinnedStrip(PHOTOS.length, 90);
  return (
    <section ref={sectionRef} className="relative isolate bg-[#232b29]" style={{ height }} aria-labelledby="highlights-title">
      {stops.map((top) => <SnapStop key={top} top={top} />)}
      <div className="sticky top-0 flex h-svh min-h-[640px] flex-col justify-center overflow-hidden">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 px-7">
          <div>
            <p className={`${hud} mb-2 text-[#b9b9ab]`}>01 / MATCH HISTORY</p>
            <h2 id="highlights-title" className={`${heading} text-[3.75rem]! leading-none! text-[#f3eddf]!`}>HIGHLIGHTS</h2>
          </div>
          <span className={`${hud} mb-1 text-[#b9b9ab]`}>{String(PHOTOS.length).padStart(2, '0')} MEMORIES</span>
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[11vw] min-[448px]:px-[49px]">
          {PHOTOS.map((photo, index) => <HighlightPhoto key={photo.src} {...photo} index={index} progress={progress} />)}
        </motion.div>
        <div className="mt-7 flex justify-center gap-2" aria-hidden>
          {PHOTOS.map((photo, index) => <Segment key={photo.src} index={index} progress={progress} />)}
        </div>
      </div>
    </section>
  );
}

const readySound = () => playTones(
  [
    { freq: 330, endFreq: 660, at: 0, dur: 0.18 },
    { freq: 830, at: 0.2, dur: 0.12 },
    { freq: 988, at: 0.32, dur: 0.4 },
  ],
  { type: 'sine', volume: 0.08 },
);

function Burst() {
  const reducedMotion = useReducedMotion();
  const [bits] = useState(() => Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * Math.PI * 2;
    const distance = 100 + Math.random() * 230;
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, spin: i * 37, color: i % 2 ? '#efa16f' : '#c4adeb' };
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {reducedMotion ? (
        <span className={`${display} border border-[#a8c5ad] bg-[#1b1d19] px-8 py-5 text-4xl text-[#f3eddf]`}>YOU’RE IN.</span>
      ) : bits.map((bit, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-3"
          style={{ backgroundColor: bit.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: bit.x, y: bit.y, opacity: 0, rotate: bit.spin }}
          transition={{ duration: 1, ease: [0.1, 0.7, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

function SquadInvite({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <section id="squad" className="relative flex min-h-svh snap-start snap-always flex-col justify-center bg-[#362a32] px-7 py-16" aria-labelledby="squad-title">
      <div className={`${hud} mb-10 flex items-center justify-between border-b border-[#f3eddf]/25 pb-4`}>
        <span>02 / SQUAD INVITE</span>
        <span className="text-[#a8c5ad]">READY CHECK</span>
      </div>
      <p className={`${hud} mb-5 uppercase leading-relaxed text-[#d2cdbf]`}>With the love and blessings of their families</p>
      <h2 id="squad-title" className={`${heading} text-[clamp(3.5rem,16vw,4.5rem)]! leading-[0.94]! text-[#f3eddf]!`}>
        <span className="text-[#c4adeb]">ADITI</span> &amp; <span className="text-[#efa16f]">ARNAV</span>
      </h2>
      <p className={`${display} mt-3 text-[2rem] font-medium uppercase leading-none text-[#a8c5ad]`}>are unlocking a new chapter!</p>
      <p className="mb-10 mt-6 max-w-[20rem] text-base leading-relaxed text-[#d2cdbf]">
        We invite you to celebrate as we level up to our next adventure together!
      </p>
      <dl className={`${hud} mb-8 grid grid-cols-2 border-y border-[#f3eddf]/25 py-4`}>
        <div><dt className="mb-2 text-[#b9b9ab]">MODE</dt><dd>ENGAGEMENT</dd></div>
        <div className="border-l border-[#f3eddf]/15 pl-4"><dt className="mb-2 text-[#b9b9ab]">SESSION</dt><dd>11.12.26 / 10 AM</dd></div>
      </dl>
      <div className={`${hud} mb-3 flex justify-between text-[#b9b9ab]`}>
        <span>YOUR RESPONSE</span>
        <span className={accepted ? 'text-[#a8c5ad]' : ''}>{accepted ? '01 / 01 READY' : '00 / 01 READY'}</span>
      </div>
      <button
        type="button"
        disabled={accepted}
        onClick={() => { setAccepted(true); onAccept(); }}
        className={`${display} ${focus} relative flex min-h-20 w-full cursor-pointer items-center justify-between border border-[#efa16f] bg-[#efa16f] px-5 text-4xl font-semibold text-[#1b1d19] transition-[background-color,transform] hover:bg-[#f6b88f] active:translate-y-0.5 focus-visible:outline-[#c4adeb] disabled:cursor-default disabled:border-[#c4adeb] disabled:bg-[#302936] disabled:text-[#c4adeb] motion-reduce:transition-none`}
      >
        <span>{accepted ? 'ACCEPTED' : 'ACCEPT'}</span>
        <span aria-hidden className="flex h-9 w-9 items-center justify-center border border-[#1b1d19] bg-[#c4adeb] text-xl text-[#1b1d19]">{accepted ? '✓' : '♥️'}</span>
      </button>
      {!accepted && (
        <button
          type="button"
          onClick={() => { setAccepted(true); onAccept(); }}
          className={`${display} ${focus} mt-3 flex min-h-14 w-full cursor-pointer items-center justify-center border border-[#c4adeb] px-5 text-3xl font-semibold text-[#c4adeb] transition-[background-color,transform] hover:bg-[#302936] active:translate-y-0.5 focus-visible:outline-[#c4adeb] motion-reduce:transition-none`}
        >
          ALSO ACCEPT
        </button>
      )}
      <div aria-hidden className="mt-2 h-1 bg-[#f3eddf]/15">
        {accepted && <motion.div className="h-full origin-left bg-[#c4adeb]" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 1.1, ease: 'linear' }} />}
      </div>
      <p aria-live="polite" className="mt-4 min-h-5 text-center text-xs text-[#b9b9ab]">
        {accepted ? 'You’re in. Opening the briefing in 1 second…' : 'We’d love to celebrate with you.'}
      </p>
    </section>
  );
}

function Briefing() {
  return (
    <section id="briefing" className="border-t border-[#f3eddf]/25 bg-[#232b29] px-7 pb-10 pt-10" aria-labelledby="briefing-title">
      <div className={`${hud} mb-6 flex justify-between text-[#b9b9ab]`}>
        <span>03 / BRIEFING</span><span>ENGAGEMENT</span>
      </div>
      <h2 id="briefing-title" className={`${heading} text-[clamp(3.5rem,15vw,3.75rem)]! leading-none! text-[#f3eddf]!`}>SAVE THE DATE.</h2>
      <div className="my-8 border-y border-[#f3eddf]/25 py-6">
        <time dateTime="2026-12-11" className="block">
          <span className={`${hud} text-[#a8c5ad]`}>MATCH DAY / FRIDAY</span>
          <span className={`${display} mt-1 flex items-center gap-5 font-medium leading-[0.85]`}>
            <span className="text-[9.5rem] tracking-[-0.06em]">11</span>
            <span className="text-[3.5rem]">DEC<br />2026</span>
          </span>
        </time>
        <dl className={`${hud} mt-6 grid grid-cols-2 border-t border-[#f3eddf]/15 pt-4`}>
          <div><dt className="mb-2 text-[#b9b9ab]">SESSION</dt><dd>MORNING</dd></div>
          <div className="border-l border-[#f3eddf]/15 pl-4"><dt className="mb-2 text-[#b9b9ab]">START TIME</dt><dd>10:00 AM</dd></div>
        </dl>
      </div>

      <div className="mb-6 border border-[#f3eddf]/25">
        <div className={`${hud} flex items-center justify-between border-b border-[#f3eddf]/25 px-3 py-3`}>
          <span className="text-[#a8c5ad]">DROP ZONE / MUMBAI</span>
          <span className="text-[#b9b9ab]">01</span>
        </div>
        <div className="relative aspect-square overflow-hidden bg-[#282b24]">
          <Image src="/images/engagement-2/minimap.webp" alt="Dota 2 style minimap with the venue marked in the centre" fill sizes="(max-width: 448px) 85vw, 392px" className="object-cover" />
          <div aria-hidden className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#a8c5ad] bg-[#1b1d19]/80">
              <span className="h-3 w-3 rotate-45 bg-[#a8c5ad]" />
            </span>
            <span className={`${hud} mt-2 whitespace-nowrap bg-[#a8c5ad] px-2 py-1 text-[#1b1d19]`}>CLUB HOUSE</span>
          </div>
        </div>
        <p className={`${hud} border-t border-[#f3eddf]/25 px-3 py-3 text-[#b9b9ab]`}>MINIMAP / NOT TO SCALE</p>
      </div>
      <h3 className={`${display} text-[2.25rem] font-medium leading-[1.05] text-[#f3eddf]!`}>
        Evershine Millennium<br />Paradise Club House
      </h3>
      <p className="mt-4 max-w-[17rem] text-sm leading-relaxed text-[#b9b9ab]">
        Thakur Village, Kandivali East,<br />Mumbai 400101
      </p>
      <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`${focus} mt-6 flex min-h-14 cursor-pointer items-center justify-between border border-[#a8c5ad] px-4 text-sm font-medium transition-colors hover:bg-[#282b24] active:bg-[#33372e] focus-visible:outline-[#a8c5ad] motion-reduce:transition-none`}>
        <span>Open in Google Maps</span>
        <span aria-hidden className="text-xl">↗</span>
      </a>
      <footer className="mt-14 border-t border-[#f3eddf]/25 pt-8 text-center">
        <p className={`${display} text-4xl font-medium uppercase`}>See you there.</p>
        <p className="mt-3 text-sm text-[#d2cdbf]">Made with love by Arnav &amp; Aditi</p>
        <p className={`${hud} mt-8 text-[#b9b9ab]`}>A + A / 11.12.2026</p>
      </footer>
    </section>
  );
}

export default function Invite() {
  const [celebrating, setCelebrating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  useSnapZone('squad');
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onAccept = () => {
    haptic([20, 40, 20, 40, 120]);
    readySound();
    setCelebrating(true);
    timer.current = setTimeout(() => {
      setCelebrating(false);
      document.getElementById('briefing')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    }, 1100);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#151713] font-[family-name:var(--font-body)] text-[#f3eddf]">
        <main className="relative mx-auto max-w-md overflow-x-clip bg-[#1b1d19]">
          <Hero />
          <Highlights />
          <SquadInvite onAccept={onAccept} />
          <Briefing />
        </main>
      </div>
      {celebrating && <Burst />}
    </MotionConfig>
  );
}
