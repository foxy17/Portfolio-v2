'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MotionConfig,
  motion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { RsvpDialog } from '~/lib/rsvp';
import { SnapStop, focusRange, haptic, playTones, usePinnedStrip, useSnapZone } from '~/lib/invite';

const DETAILS: { label: string; value: string; note: string; href?: string }[] = [
  { label: 'DATE', value: '11 DEC 2026', note: 'Friday' },
  { label: 'TIME', value: '10:00 AM', note: 'Morning' },
  {
    label: 'VENUE',
    value: 'Evershine Millennium Paradise Club House',
    note: 'Thakur Village, Kandivali East, Mumbai 400101',
    href: 'https://maps.app.goo.gl/DARdzgwTAzPLt2yo7',
  },
];

const PHOTOS = [
  { src: '/images/engagement/us-5.jpg', caption: 'TRACK 01 · BOMBAY NIGHTS' },
  { src: '/images/engagement/us-2.jpg', caption: 'TRACK 02 · SIDE QUEST' },
];

const IMG = '/images/engagement';
const CABINS = 8;
const CABIN_COLORS = 4; // cabin-0..3.webp, pre-tinted
// Ferris wheel only appears once every part has loaded: wheel + stand + one per cabin.
const WHEEL_PARTS = 2 + CABINS;
const HERO_SVH = 120;
const PHOTO_SVH_EACH = 90;

// Fixed positions so server and client render the same sparkles.
const SPARKLES = [
  [8, 12, 0], [22, 85, 0.6], [34, 6, 1.3], [48, 90, 0.9], [62, 15, 1.8], [80, 70, 0.3],
];

const pixel = 'font-[family-name:var(--font-pixel)]';
const condensed = 'font-[family-name:var(--font-condensed)]';
// globals.css styles h1/h2 unlayered (Paytone, black), so override with `!`.
const heading = 'font-[family-name:var(--font-pixel)]! font-normal! text-white!';

// Chunky 8-direction navy outline + offset pink block shadow, so the names pop off the sky.
const NAME_SHADOW = [
  ...[[3, 0], [-3, 0], [0, 3], [0, -3], [3, 3], [-3, -3], [3, -3], [-3, 3]].map(
    ([x, y]) => `${x}px ${y}px 0 #0C327D`,
  ),
  '7px 7px 0 #FF7AC8',
  '10px 10px 0 #0C327D',
].join(', ');

function Win({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-2 border-[#0C327D] bg-[#FFBFE9]/90 shadow-[6px_6px_0_#0C327D] ${className}`}
    >
      <div className="flex items-center justify-between bg-[#0C327D] px-2 py-1 text-white">
        <span className={`${pixel} text-lg tracking-wider`}>{title}</span>
        <span className="flex gap-1" aria-hidden>
          {['_', '□', '×'].map((c) => (
            <span
              key={c}
              className={`${pixel} grid h-5 w-5 place-items-center border border-white text-sm leading-none`}
            >
              {c}
            </span>
          ))}
        </span>
      </div>
      {children}
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { type: 'spring', stiffness: 120, damping: 18 },
} as const;

function Floaty({ src, className }: { src: string; className: string }) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Image src={src} alt="" width={160} height={160} unoptimized className="h-full w-full" />
    </motion.div>
  );
}

// Pixel hearts drifting upward behind a section.
function RisingHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[10, 28, 47, 66, 84].map((left, i) => (
        <motion.span
          key={left}
          className={`${pixel} absolute bottom-0 text-3xl`}
          style={{ left: `${left}%`, color: i % 2 ? '#FFFFFF' : '#FF7AC8' }}
          animate={{ y: [0, -420], opacity: [0, 1, 0], x: [0, i % 2 ? 14 : -14, 0] }}
          transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

function Sparkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SPARKLES.map(([top, left, delay]) => (
        <motion.svg
          key={`${top}-${left}`}
          viewBox="0 0 7 7"
          className="absolute h-3 w-3 fill-[#F7ED75] [shape-rendering:crispEdges]"
          style={{ top: `${top}%`, left: `${left}%` }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeInOut' }}
        >
          <path d="M3 0h1v3h3v1H4v3H3V4H0V3h3z" />
        </motion.svg>
      ))}
    </div>
  );
}

// Cloud that drifts with scroll (CSS class from HERO_CSS) and also bobs gently on its own.
// Fades in once loaded so it never pops in half-drawn.
function Cloud({ src, className }: { src: string; className: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute will-change-transform transition-opacity duration-700 ${loaded ? '' : 'opacity-0!'} ${className}`}
    >
      <motion.div
        animate={{ x: [0, 12, 0], y: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src={src}
          alt=""
          width={1200}
          height={525}
          unoptimized
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="h-auto w-full"
        />
      </motion.div>
    </div>
  );
}

function Cabin({ index, onDone }: { index: number; onDone: () => void }) {
  const angle = (index / CABINS) * Math.PI * 2;
  return (
    <div
      className="cabin-counter absolute w-[15%] -translate-x-1/2 will-change-transform"
      style={{
        left: `${50 + 44 * Math.cos(angle)}%`,
        top: `${50 + 44 * Math.sin(angle)}%`,
        transformOrigin: '50% 0%',
      }}
    >
      <Image
        src={`${IMG}/cabin-${index % CABIN_COLORS}.webp`}
        alt=""
        width={128}
        height={128}
        unoptimized
        loading="eager"
        onLoad={onDone}
        onError={onDone}
        className="h-auto w-full [image-rendering:pixelated]"
      />
    </div>
  );
}

// Letters drop in one by one.
function Name({ word, start }: { word: string; start: number }) {
  return (
    <span className="block whitespace-nowrap" aria-hidden>
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: -80, rotate: -20, scale: 1.6 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14, delay: start + i * 0.08 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// Hero scroll effects (sky, clouds, wheel rise, title) run as CSS scroll-driven animations (compositor thread, no JS per
// scroll frame). Progress 0 = hero top at viewport top, 1 = hero bottom at viewport top.
// Browsers without animation-timeline just get the static scene.
const HERO_CSS = `
@supports (animation-timeline: view()) {
  .hero-tl { view-timeline-name: --hero; }
  .hero-tl .sky-drift, .hero-tl .wheel-rise,
  .hero-tl .cloud-back, .hero-tl .cloud-top, .hero-tl .cloud-front, .hero-tl .hero-title {
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: --hero;
    animation-range: contain 0% exit 100%;
  }
  .sky-drift { animation-name: sky-drift; }
  .wheel-rise { animation-name: wheel-rise; }
  .cloud-back { animation-name: cloud-back; }
  .cloud-top { animation-name: cloud-top; }
  .cloud-front { animation-name: cloud-front; }
  .hero-title { animation-name: hero-title; }
}
@keyframes sky-drift { to { translate: 0 -6%; } }
@keyframes wheel-rise { from { translate: 0 10%; } to { translate: 0 -6%; } }
/* Wheel spins on its own clock, not with scroll; cabins counter-spin to hang upright. */
.wheel-spin { animation: wheel-spin 40s linear infinite; }
.cabin-counter { animation: cabin-counter 40s linear infinite; }
@keyframes wheel-spin { to { rotate: 360deg; } }
@keyframes cabin-counter { to { rotate: -360deg; } }
@keyframes cloud-back { to { translate: -45% 0; } }
@keyframes cloud-top { to { translate: 55% 0; } }
@keyframes cloud-front { to { translate: -60% 0; } }
@keyframes hero-title {
  15% { opacity: 1; }
  40% { opacity: 0; }
  50%, 100% { translate: 0 -180px; scale: 0.8; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .hero-tl * { animation: none !important; } }
`;

function Hero() {
  const [skyLoaded, setSkyLoaded] = useState(false);
  const [wheelParts, setWheelParts] = useState(0);
  const partDone = () => setWheelParts((n) => n + 1);
  // Safety net: never leave the wheel hidden if a load event goes missing.
  useEffect(() => {
    const t = setTimeout(() => setWheelParts((n) => Math.max(n, WHEEL_PARTS)), 4000);
    return () => clearTimeout(t);
  }, []);
  const wheelReady = wheelParts >= WHEEL_PARTS;

  return (
    <section className="hero-tl relative" style={{ height: `${HERO_SVH}svh` }}>
      <style>{HERO_CSS}</style>
      <SnapStop top="0" />
      {/* Gradient stands in for the sky image until it arrives, so the screen is never blank. */}
      <div className="sticky top-0 h-svh overflow-hidden bg-gradient-to-b from-[#A99BEB] via-[#7EC4F2] to-[#F7B6E6]">
        <div
          className={`sky-drift absolute inset-0 scale-110 transition-opacity duration-500 will-change-transform ${skyLoaded ? '' : 'opacity-0'}`}
        >
          {/* Load order: sky (preloaded in <head>) → wheel (high) → the other hero layers (eager)
              → everything below the fold (lazy, Next's default). */}
          <Image
            src={`${IMG}/sky.webp`}
            alt=""
            fill
            preload
            unoptimized
            onLoad={() => setSkyLoaded(true)}
            onError={() => setSkyLoaded(true)}
            className="object-cover"
          />
        </div>
        <Sparkles />

        <Cloud src={`${IMG}/cloud-2.webp`} className="cloud-back left-[5%] top-[38%] w-[95%] opacity-80" />
        <Cloud src={`${IMG}/cloud-1.webp`} className="cloud-top -left-[25%] top-[6%] w-[75%]" />

        {/* Ferris wheel: stand stays put, wheel turns continuously, cabins counter-rotate to hang upright. */}
        <div
          aria-hidden
          className="wheel-rise absolute left-[22%] top-[40%] aspect-square w-[115%] will-change-transform"
        >
          {/* Whole wheel fades/pops in together once all its parts are loaded. */}
          <div
            className={`absolute inset-0 transition-[opacity,scale] duration-700 ease-out ${wheelReady ? '' : 'scale-90 opacity-0'}`}
          >
            <Image
              src={`${IMG}/stand.webp`}
              alt=""
              width={768}
              height={768}
              unoptimized
              loading="eager"
              onLoad={partDone}
              onError={partDone}
              className="absolute left-[12%] top-1/2 h-auto w-[76%] [image-rendering:pixelated]"
            />
            <div className="wheel-spin absolute inset-0 will-change-transform">
              <Image
                src={`${IMG}/wheel.webp`}
                alt=""
                fill
                unoptimized
                loading="eager"
                fetchPriority="high"
                onLoad={partDone}
                onError={partDone}
                className="[image-rendering:pixelated]"
              />
              {Array.from({ length: CABINS }, (_, i) => (
                <Cabin key={i} index={i} onDone={partDone} />
              ))}
            </div>
          </div>
        </div>

        <Cloud src={`${IMG}/cloud-1.webp`} className="cloud-front -right-[20%] -bottom-[4%] w-[70%]" />

        {/* Blend the sky into the page gradient below the hero. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#AFC6EE]" />

        <div className="hero-title relative flex h-full flex-col items-center pt-[13svh] text-center text-white">
          <motion.p
            className={`${pixel} bg-[#0C327D] px-3 text-xl tracking-[0.3em]`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            YOU&apos;RE INVITED TO
          </motion.p>
          {/* Soft glow behind the names. */}
          <div className="relative mt-3">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),transparent)]"
            />
            <h1
              aria-label="Aditi & Arnav's"
              className={`${heading} relative text-[clamp(5rem,27vw,7rem)]! leading-[0.85] tracking-normal!`}
              style={{ textShadow: NAME_SHADOW }}
            >
              <Name word="ADITI" start={0.4} />
              <motion.span
                aria-hidden
                className="block text-[#F7ED75]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.4, 1] }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                &amp;
              </motion.span>
              <Name word="ARNAV'S" start={1.1} />
            </h1>
          </div>
          <motion.p
            className={`${pixel} mt-6 border-[3px] border-white bg-[#FF7AC8] px-4 py-1 text-[clamp(2rem,10vw,2.75rem)] leading-none tracking-wider shadow-[6px_6px_0_#0C327D]`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 1.7 }}
          >
            ♥ ENGAGEMENT ♥
          </motion.p>
          <motion.p
            className={`${pixel} absolute bottom-10 bg-[#0C327D] px-2 text-lg tracking-widest`}
            animate={{ opacity: [1, 0.2, 1], y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ▼ SCROLL ▼
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Card in the pinned strip: straight and full-size when centred, tilted and smaller either side.
function PhotoCard({
  src,
  caption,
  index,
  progress,
}: {
  src: string;
  caption: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const range = focusRange(index, PHOTOS.length);
  const rotate = useTransform(progress, range, [10, 0, -10]);
  const scale = useTransform(progress, range, [0.82, 1, 0.82]);
  const y = useTransform(progress, range, [30, 0, 30]);
  const imgScale = useTransform(progress, range, [1.25, 1, 1.25]);

  return (
    <motion.div style={{ rotate, scale, y }} className="w-[78vw] max-w-[340px] shrink-0">
      <Win title={`photo_0${index + 1}.jpg`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-[#0C327D]">
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <Image src={src} alt={caption} fill sizes="340px" className="object-cover" />
          </motion.div>
        </div>
        <p className={`${pixel} px-3 py-1 text-lg text-[#0C327D]`}>{caption}</p>
      </Win>
    </motion.div>
  );
}

// Vertical scroll drives the photo strip sideways while the section is pinned.
function Photos() {
  const { sectionRef, trackRef, progress: scrollYProgress, x, height, stops } = usePinnedStrip(
    PHOTOS.length,
    PHOTO_SVH_EACH,
  );

  return (
    <section ref={sectionRef} className="relative" style={{ height }}>
      {/* One snap stop per photo, landing it dead centre. */}
      {stops.map((top) => (
        <SnapStop key={top} top={top} />
      ))}
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <Floaty src={`${IMG}/hearts.webp`} className="right-3 top-[4%] z-10 h-16 w-16" />
        <h2
          className={`${heading} mb-8 px-5 text-5xl! tracking-wider drop-shadow-[3px_3px_0_#0C327D]`}
        >
          PLAYLIST: US
        </h2>
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[11vw] min-[448px]:px-12">
          {PHOTOS.map((p, i) => (
            <PhotoCard key={p.src} {...p} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>
        {/* Progress dots. */}
        <div className="mt-8 flex justify-center gap-2" aria-hidden>
          {PHOTOS.map((p, i) => (
            <Dot key={p.src} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Dot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, focusRange(index, PHOTOS.length), [1, 3, 1]);
  return <motion.span className="h-2.5 w-2.5 bg-white shadow-[2px_2px_0_#0C327D]" style={{ scaleX }} />;
}

// Tiny chiptune arpeggio (C6 E6 G6 C7).
const chime = () =>
  playTones(
    [1047, 1319, 1568, 2093].map((freq, i) => ({ freq, at: i * 0.09, dur: i === 3 ? 0.45 : 0.12 })),
    { type: 'square' },
  );

const RAIN_COLORS = ['#FF7AC8', '#FFFFFF', '#AF9CE6', '#F7ED75', '#FFBFE9'];

// One burst of hearts falling from the top of the screen; remounted (via key) on each accept.
function HeartRain() {
  const [hearts] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      left: Math.random() * 100,
      size: 1.2 + Math.random() * 2.2,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.6,
      drift: (Math.random() - 0.5) * 80,
      spin: (Math.random() - 0.5) * 120,
      color: RAIN_COLORS[i % RAIN_COLORS.length],
    })),
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className={`${pixel} absolute -top-16 leading-none drop-shadow-[2px_2px_0_#0C327D]`}
          style={{ left: `${h.left}%`, fontSize: `${h.size}rem`, color: h.color }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '115vh', x: h.drift, rotate: h.spin, opacity: [1, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, ease: 'easeIn' }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};
const child = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Invite() {
  const [rain, setRain] = useState(0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const closeRsvp = useCallback(() => setRsvpOpen(false), []);
  useSnapZone('invitation');

  const openRsvp = (e: React.MouseEvent) => {
    e.preventDefault();
    setRsvpOpen(true);
  };

  const accept = () => {
    setRsvpOpen(false);
    haptic();
    chime();
    setRain((n) => n + 1);
    setTimeout(() => {
      document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#C9D3F0] bg-[linear-gradient(#ffffff40_1px,transparent_1px),linear-gradient(90deg,#ffffff40_1px,transparent_1px)] bg-[size:24px_24px] text-[#0C327D]">
        <main className="relative mx-auto max-w-md overflow-x-clip bg-gradient-to-b from-[#F6B8E4] via-[#7DC8F1] to-[#C9B6F0] pb-10">
          <Hero />

          <Photos />

          {/* Invitation — last snap stop; free scrolling from here down. */}
          <section id="invitation" className="relative flex min-h-svh snap-start snap-always items-center px-5 py-20">
            <RisingHearts />
            <Floaty src={`${IMG}/ring.webp`} className="right-2 top-[14%] z-10 h-24 w-24" />
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 160, damping: 13 }}
            >
              <Win title="invite.exe">
                <motion.div
                  className={`${condensed} space-y-4 p-5 text-center`}
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <motion.p variants={child} className="text-sm uppercase tracking-[0.25em]">
                    With the love and blessings of their families
                  </motion.p>
                  <motion.p variants={child} className={`${pixel} text-5xl leading-none`}>
                    ADITI <span className="text-[#FF7AC8]">&amp;</span> ARNAV
                  </motion.p>
                  <motion.p variants={child} className={`${pixel} text-2xl leading-tight text-[#FF7AC8]`}>
                    are unlocking a new chapter!
                  </motion.p>
                  <motion.p variants={child} className="text-lg">
                    We invite you to celebrate as we level up to our next adventure together!
                  </motion.p>
                  <motion.div variants={child} className={`${pixel} flex justify-center gap-3 pt-2 text-xl`}>
                    {['ACCEPT ♥️', 'ALSO ACCEPT'].map((label) => (
                      <motion.a
                        key={label}
                        href="#details"
                        onClick={openRsvp}
                        whileTap={{ scale: 0.92 }}
                        className="border-2 border-[#0C327D] bg-white px-3 py-0.5 shadow-[3px_3px_0_#0C327D] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                      >
                        {label}
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </Win>
            </motion.div>
          </section>


          {/* Details */}
          <section id="details" className="relative px-5 py-16">
            <RisingHearts />
            <motion.h2
              {...reveal}
              className={`${heading} relative mb-6 text-5xl! tracking-wider drop-shadow-[3px_3px_0_#0C327D]`}
            >
              THE DETAILS
            </motion.h2>
            <div className="relative space-y-5">
              {DETAILS.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: i % 2 ? 90 : -90, rotate: i % 2 ? 6 : -6 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                >
                  <Win title={`${d.label.toLowerCase()}.txt`}>
                    <div className="bg-white/70 p-4">
                      <span className={`${pixel} text-xl tracking-widest text-[#FF7AC8]`}>{d.label}</span>
                      <span className={`${pixel} block text-4xl leading-none`}>{d.value}</span>
                      <span className={`${condensed} mt-1 block text-sm uppercase tracking-widest`}>{d.note}</span>
                      {d.href && (
                        <a
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${pixel} mt-3 inline-block border-2 border-[#0C327D] bg-white px-3 py-0.5 text-xl shadow-[3px_3px_0_#0C327D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none`}
                        >
                          OPEN IN MAPS ↗
                        </a>
                      )}
                    </div>
                  </Win>
                </motion.div>
              ))}
            </div>
            <p className={`${pixel} relative mt-16 text-center text-lg text-white`}>made with ♥ by arnav &amp; aditi</p>
          </section>
        </main>
      </div>
      {rain > 0 && <HeartRain key={rain} />}
      <RsvpDialog open={rsvpOpen} invite="invite-1" theme="pixel" title="See you there!" onClose={closeRsvp} onSaved={accept} />
    </MotionConfig>
  );
}
