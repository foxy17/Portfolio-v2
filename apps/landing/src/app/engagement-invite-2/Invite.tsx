'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MotionConfig, motion, useTransform, type MotionValue } from 'motion/react';
import { SnapStop, focusRange, haptic, playTones, usePinnedStrip, useSnapZone } from '~/lib/invite';

// Neon esports take on the invite: match-found hero, replay highlights, squad invite,
// mission briefing. Inspired by MOBA / battle-royale / tactical-shooter UI conventions;
// no official logos, characters or art from any game.

const VENUE_QUERY =
  'Evershine Millennium Paradise Club House, Thakur Village, Kandivali East, Mumbai 400101';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`;

const PHOTOS = [
  { src: '/images/engagement/photo-1.jpg', caption: 'GOLDEN HOUR' },
  { src: '/images/engagement/photo-2.jpg', caption: 'THE RING' },
  { src: '/images/engagement/photo-3.jpg', caption: 'BLUE HOUR' },
];

const IMG = '/images/engagement-2';
const HERO_SVH = 120;
const PHOTO_SVH_EACH = 90;

const display = 'font-[family-name:var(--font-display)]';
const hud = 'font-[family-name:var(--font-hud)]';
// globals.css styles h1/h2 unlayered (Paytone, black), so override with `!`.
const heading = 'font-[family-name:var(--font-display)]! font-semibold! text-white! tracking-wide!';

const CYAN = '#19F0FF';
const MAGENTA = '#FF2BD6';
const GOLD = '#FFB224';
const NEON_TEXT = `0 0 6px ${CYAN}, 0 0 18px ${CYAN}99`;
const NEON_TEXT_PINK = `0 0 6px ${MAGENTA}, 0 0 18px ${MAGENTA}99`;
// Angled "cut corner" panel shape used everywhere.
const CUT = '[clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]';

// Glowing HUD panel with cut corners and a small header strip.
function Panel({
  label,
  tag,
  accent = CYAN,
  children,
  className = '',
}: {
  label: string;
  tag?: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ filter: `drop-shadow(0 0 10px ${accent}55)` }}>
      <div className={`${CUT} p-[1.5px]`} style={{ background: accent }}>
        <div className={`${CUT} bg-[#0B0A1A]/95`}>
          <div
            className={`${hud} flex items-center justify-between px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em]`}
            style={{ background: `${accent}22`, color: accent }}
          >
            <span>{label}</span>
            {tag && <span className="text-white/70">{tag}</span>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { type: 'spring', stiffness: 120, damping: 18 },
} as const;

// Hero scroll effects run as CSS scroll-driven animations (compositor thread, no JS per frame).
// The grid floor scrolls on its own clock. Progress 0 = hero top at viewport top, 1 = bottom.
const HERO_CSS = `
@supports (animation-timeline: view()) {
  .g-hero { view-timeline-name: --ghero; }
  .g-hero .g-bg, .g-hero .g-p1, .g-hero .g-p2, .g-hero .g-title {
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: --ghero;
    animation-range: contain 0% exit 100%;
  }
  .g-bg { animation-name: g-bg; }
  .g-p1 { animation-name: g-p1; }
  .g-p2 { animation-name: g-p2; }
  .g-title { animation-name: g-title; }
}
@keyframes g-bg { to { translate: 0 -8%; scale: 1.08; } }
@keyframes g-p1 { 40%, 100% { translate: -70% 0; opacity: 0; } }
@keyframes g-p2 { 40%, 100% { translate: 70% 0; opacity: 0; } }
@keyframes g-title { 35%, 100% { translate: 0 -120px; opacity: 0; } }
.g-grid { animation: g-grid 1.6s linear infinite; }
@keyframes g-grid { to { translate: 0 48px; } }
@media (prefers-reduced-motion: reduce) { .g-hero * { animation: none !important; } }
`;

function PlayerCard({
  side,
  name,
  src,
  accent,
  ready,
  onDone,
}: {
  side: 'left' | 'right';
  name: string;
  src: string;
  accent: string;
  ready: boolean;
  onDone: () => void;
}) {
  const left = side === 'left';
  return (
    <div className={`${left ? 'g-p1' : 'g-p2'} w-[44%] will-change-transform`}>
      <motion.div
        initial={{ opacity: 0, x: left ? -120 : 120, skewX: left ? -8 : 8 }}
        animate={ready ? { opacity: 1, x: 0, skewX: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 140, damping: 16, delay: left ? 0.6 : 0.75 }}
      >
        <div className={`${CUT} p-[2px]`} style={{ background: accent }}>
          <div className={`${CUT} relative aspect-[3/4] overflow-hidden bg-[#0B0A1A]`}>
            <Image
              src={src}
              alt={`${name}, player ${left ? 1 : 2}`}
              fill
              unoptimized
              loading="eager"
              fetchPriority="high"
              onLoad={onDone}
              onError={onDone}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07060F] to-transparent" />
            <span
              className={`${hud} absolute left-2 top-1.5 text-[10px] font-bold uppercase tracking-[0.25em]`}
              style={{ color: accent }}
            >
              Player {left ? 1 : 2}
            </span>
          </div>
        </div>
        <p
          className={`${display} mt-1 text-center text-5xl font-bold leading-none text-white`}
          style={{ textShadow: left ? NEON_TEXT : NEON_TEXT_PINK }}
        >
          {name}
        </p>
        <p className={`${hud} text-center text-xs font-bold uppercase tracking-[0.2em] text-white/70`}>
          LV 99 · <span style={{ color: GOLD }}>Ready</span>
        </p>
      </motion.div>
    </div>
  );
}

function Hero() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [portraits, setPortraits] = useState(0);
  const portraitDone = () => setPortraits((n) => n + 1);
  // Never leave the cards hidden if a load event goes missing.
  useEffect(() => {
    const t = setTimeout(() => setPortraits((n) => Math.max(n, 2)), 4000);
    return () => clearTimeout(t);
  }, []);
  const ready = portraits >= 2;

  return (
    <section className="g-hero relative" style={{ height: `${HERO_SVH}svh` }}>
      <style>{HERO_CSS}</style>
      <SnapStop top="0" />
      {/* Dark gradient stands in for the arena until it loads. */}
      <div className="sticky top-0 h-svh overflow-hidden bg-gradient-to-b from-[#120B2E] via-[#07060F] to-[#1A0830]">
        <div className={`g-bg absolute inset-0 transition-opacity duration-700 will-change-transform ${bgLoaded ? 'opacity-70' : 'opacity-0'}`}>
          {/* Load order: arena (preloaded) → portraits (high) → below the fold (lazy). */}
          <Image
            src={`${IMG}/arena.webp`}
            alt=""
            fill
            preload
            unoptimized
            onLoad={() => setBgLoaded(true)}
            onError={() => setBgLoaded(true)}
            className="object-cover"
          />
        </div>

        {/* Neon perspective grid floor. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden [perspective:300px]">
          <div className="absolute inset-x-[-50%] -top-[48px] bottom-0 origin-top [transform:rotateX(62deg)]">
            <div
              className="g-grid absolute inset-0 -top-[48px] will-change-transform"
              style={{
                backgroundImage: `linear-gradient(${CYAN}AA 1.5px, transparent 1.5px), linear-gradient(90deg, ${MAGENTA}88 1.5px, transparent 1.5px)`,
                backgroundSize: '48px 48px',
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07060F] via-transparent to-transparent" />
        </div>

        {/* Top HUD strip. */}
        <div
          className={`${hud} absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80`}
        >
          <span className="flex items-center gap-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-[#FF3B3B]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Live
          </span>
          <span style={{ color: CYAN }}>Ranked · Engagement</span>
          <span>11.12.26</span>
        </div>

        <div className="relative flex h-full flex-col items-center pt-[11svh]">
          <div className="g-title text-center will-change-transform">
            <motion.p
              className={`${hud} text-sm font-bold uppercase tracking-[0.45em]`}
              style={{ color: GOLD }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Duo queue
            </motion.p>
            {/* One-shot glitch-in, then a steady glow. */}
            <motion.h1
              aria-label="Match found"
              className={`${heading} text-[clamp(3.5rem,19vw,5.5rem)]! leading-[0.85]`}
              style={{ textShadow: NEON_TEXT }}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0.3, 1, 0.6, 1], x: [0, -6, 5, -3, 2, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              MATCH FOUND
            </motion.h1>
          </div>

          <div className="mt-[4svh] flex w-full items-start justify-center gap-3 px-4">
            <PlayerCard side="left" name="ARNAV" src={`${IMG}/p1.webp`} accent={CYAN} ready={ready} onDone={portraitDone} />
            <motion.div
              className="mt-[18%] flex flex-col items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={ready ? { opacity: 1, scale: 1 } : undefined}
              transition={{ type: 'spring', delay: 1.1 }}
            >
              <motion.span
                className="text-4xl"
                style={{ color: MAGENTA, textShadow: NEON_TEXT_PINK }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ♥
              </motion.span>
              <span className={`${hud} text-xs font-bold tracking-[0.3em] text-white`}>DUO</span>
            </motion.div>
            <PlayerCard side="right" name="ADITI" src={`${IMG}/p2.webp`} accent={MAGENTA} ready={ready} onDone={portraitDone} />
          </div>

          <motion.p
            className={`${hud} mt-6 text-center text-sm font-bold uppercase tracking-[0.3em] text-white/80`}
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 1.4 }}
          >
            are getting <span style={{ color: GOLD }}>engaged</span>
          </motion.p>

          <motion.p
            className={`${hud} absolute bottom-8 text-xs font-bold uppercase tracking-[0.35em]`}
            style={{ color: CYAN }}
            animate={{ opacity: [1, 0.3, 1], y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ▼ Swipe to continue ▼
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Replay card: straight and full-size when centred, angled and smaller either side.
function ReplayCard({
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
  const rotateY = useTransform(progress, range, [-28, 0, 28]);
  const scale = useTransform(progress, range, [0.8, 1, 0.8]);
  // Function form: Motion would otherwise hand opacity to a native scroll timeline, which
  // rejects this range's negative start offset for the first card.
  const opacity = useTransform(progress, (p) => 1 - Math.min(Math.abs(p - range[1]) / (range[2] - range[1]), 1) * 0.5);
  const accent = index % 2 ? MAGENTA : CYAN;

  return (
    <motion.div style={{ rotateY, scale, opacity }} className="w-[78vw] max-w-[340px] shrink-0 [perspective:800px]">
      <Panel label={`▶ Replay 0${index + 1}`} tag="● REC" accent={accent}>
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src={src} alt={caption} fill sizes="340px" className="object-cover" />
          {/* Viewfinder brackets + scanlines. */}
          <div aria-hidden className="pointer-events-none absolute inset-3">
            {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(
              (c) => (
                <span key={c} className={`absolute h-6 w-6 ${c}`} style={{ borderColor: accent }} />
              ),
            )}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px)' }}
          />
        </div>
        {/* Kill-feed style caption. */}
        <p className={`${hud} flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white`}>
          <span style={{ color: CYAN }}>Arnav</span>
          <span style={{ color: MAGENTA }}>♥</span>
          <span style={{ color: MAGENTA }}>Aditi</span>
          <span className="ml-auto text-white/60">{caption}</span>
        </p>
      </Panel>
    </motion.div>
  );
}

function Segment({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [, center, next] = focusRange(index, PHOTOS.length);
  const opacity = useTransform(progress, (p) => 1 - Math.min(Math.abs(p - center) / (next - center), 1) * 0.75);
  return <motion.span className="h-1.5 w-10" style={{ opacity, background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />;
}

function Highlights() {
  const { sectionRef, trackRef, progress, x, height, stops } = usePinnedStrip(PHOTOS.length, PHOTO_SVH_EACH);
  return (
    <section ref={sectionRef} className="relative" style={{ height }}>
      {stops.map((top) => (
        <SnapStop key={top} top={top} />
      ))}
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mb-6 px-5">
          <p className={`${hud} text-xs font-bold uppercase tracking-[0.4em]`} style={{ color: GOLD }}>
            Play of the game
          </p>
          <h2 className={`${heading} text-6xl! leading-none`} style={{ textShadow: NEON_TEXT_PINK }}>
            HIGHLIGHTS
          </h2>
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[11vw] min-[448px]:px-12">
          {PHOTOS.map((p, i) => (
            <ReplayCard key={p.src} {...p} index={i} progress={progress} />
          ))}
        </motion.div>
        <div className="mt-8 flex justify-center gap-2" aria-hidden>
          {PHOTOS.map((p, i) => (
            <Segment key={p.src} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}

// "Ready check" sound: quick rising sweep, then a two-note confirm.
const readySound = () =>
  playTones(
    [
      { freq: 220, endFreq: 880, at: 0, dur: 0.18 },
      { freq: 988, at: 0.2, dur: 0.12 },
      { freq: 1319, at: 0.32, dur: 0.4 },
    ],
    { type: 'sawtooth', volume: 0.05 },
  );

const BURST_COLORS = [CYAN, MAGENTA, GOLD, '#FFFFFF', '#8A5CFF'];

// Neon shards + hearts bursting out from the centre of the screen; remounted (via key) per accept.
function Burst() {
  const [bits] = useState(() =>
    Array.from({ length: 40 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 260;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        spin: (Math.random() - 0.5) * 540,
        heart: i % 3 === 0,
        size: 8 + Math.random() * 14,
        color: BURST_COLORS[i % BURST_COLORS.length],
        delay: Math.random() * 0.15,
      };
    }),
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: b.heart ? undefined : b.size,
            height: b.heart ? undefined : b.size / 3,
            background: b.heart ? undefined : b.color,
            color: b.color,
            fontSize: b.heart ? b.size * 1.6 : undefined,
            boxShadow: b.heart ? undefined : `0 0 10px ${b.color}`,
            textShadow: b.heart ? `0 0 10px ${b.color}` : undefined,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: b.x, y: b.y, opacity: 0, rotate: b.spin, scale: 1 }}
          transition={{ duration: 1.1, delay: b.delay, ease: [0.1, 0.7, 0.3, 1] }}
        >
          {b.heart ? '♥' : null}
        </motion.span>
      ))}
    </div>
  );
}

function SquadInvite({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [declineTries, setDeclineTries] = useState(0);

  const accept = () => {
    setAccepted(true);
    onAccept();
  };

  return (
    <section id="squad" className="relative flex min-h-svh snap-start snap-always items-center px-5 py-20">
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: 'spring', stiffness: 160, damping: 15 }}
      >
        <Panel label={accepted ? 'Match accepted ✓' : 'Incoming squad invite'} tag="1 / 1" accent={accepted ? GOLD : CYAN}>
          <div className={`${hud} space-y-5 p-5 text-center text-white`}>
            <div className="relative mx-auto h-28 w-28">
              <Image src={`${IMG}/ring.webp`} alt="" fill unoptimized className="object-contain" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Legendary item unlocked
            </p>
            <p className={`${display} text-5xl font-bold leading-none`}>
              <span style={{ color: CYAN, textShadow: NEON_TEXT }}>ARNAV</span>{' '}
              <span style={{ color: MAGENTA }}>&amp;</span>{' '}
              <span style={{ color: MAGENTA, textShadow: NEON_TEXT_PINK }}>ADITI</span>
            </p>
            <p className="text-lg font-semibold leading-snug">
              invited you to their squad to celebrate their <span style={{ color: GOLD }}>engagement</span>.
            </p>
            <dl className="grid grid-cols-2 gap-2 text-left text-xs font-bold uppercase tracking-widest">
              {[
                ['Mode', 'Engagement'],
                ['Match', 'Fri 11.12.26'],
                ['Queue', 'Morning'],
                ['Region', 'Mumbai'],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 px-3 py-2">
                  <dt className="text-white/50">{k}</dt>
                  <dd style={{ color: CYAN }}>{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center justify-center gap-3 pt-1">
              <motion.button
                type="button"
                onClick={accept}
                whileTap={{ scale: 0.94 }}
                className={`${display} ${CUT} relative px-7 pb-0.5 pt-1.5 text-3xl font-bold uppercase leading-none text-[#07060F]`}
                style={{ background: GOLD, boxShadow: `0 0 24px ${GOLD}` }}
              >
                {accepted ? 'Accepted' : 'Accept'}
                {/* Ready-check timer bar, loops until accepted. */}
                {!accepted && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#07060F]/60"
                    animate={{ scaleX: [1, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setDeclineTries((n) => n + 1)}
                animate={declineTries ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                key={declineTries}
                transition={{ duration: 0.4 }}
                className={`${display} ${CUT} border border-white/20 px-5 pb-0.5 pt-1.5 text-2xl font-semibold uppercase leading-none text-white/50`}
              >
                {declineTries ? 'Nice try' : 'Decline'}
              </motion.button>
            </div>
          </div>
        </Panel>
      </motion.div>
    </section>
  );
}

// Pulsing location ping on the map.
function Ping() {
  return (
    <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {[0, 0.6].map((delay) => (
        <motion.span
          key={delay}
          className="absolute -left-6 -top-6 h-12 w-12 rounded-full border-2"
          style={{ borderColor: GOLD }}
          animate={{ scale: [0.3, 1.6], opacity: [1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay, ease: 'easeOut' }}
        />
      ))}
      <span className="block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />
    </span>
  );
}

const BRIEFING: { label: string; value: string; note: string; accent: string }[] = [
  { label: 'Objective', value: 'Celebrate the duo', note: 'Arnav & Aditi · engagement', accent: GOLD },
  { label: 'Match day', value: '11.12.2026', note: 'Friday', accent: CYAN },
  { label: 'Drop time', value: 'TBA', note: 'Morning', accent: MAGENTA }, // TODO: exact time
];

function Briefing() {
  return (
    <section id="briefing" className="relative px-5 py-16">
      <motion.div {...reveal} className="mb-6">
        <p className={`${hud} text-xs font-bold uppercase tracking-[0.4em]`} style={{ color: CYAN }}>
          Classified · eyes only
        </p>
        <h2 className={`${heading} text-6xl! leading-none`} style={{ textShadow: NEON_TEXT }}>
          MISSION BRIEFING
        </h2>
      </motion.div>
      <div className="space-y-5">
        {BRIEFING.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16 }}
          >
            <Panel label={b.label} tag={`0${i + 1}`} accent={b.accent}>
              <div className="px-4 py-3">
                <p className={`${display} text-4xl font-bold leading-none text-white`}>{b.value}</p>
                <p className={`${hud} text-sm font-bold uppercase tracking-widest text-white/60`}>{b.note}</p>
              </div>
            </Panel>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <Panel label="Drop zone" tag="04" accent={GOLD}>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={`${IMG}/map.webp`} alt="Map of the venue area" fill unoptimized className="object-cover" />
              <Ping />
            </div>
            <div className="space-y-1 px-4 py-3">
              <p className={`${display} text-3xl font-bold leading-none text-white`}>
                Evershine Millennium Paradise Club House
              </p>
              <p className={`${hud} text-sm font-bold uppercase tracking-widest text-white/60`}>
                Thakur Village, Kandivali East, Mumbai 400101
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${display} ${CUT} mt-3 inline-block px-5 pb-0.5 pt-1.5 text-2xl font-bold uppercase leading-none text-[#07060F]`}
                style={{ background: GOLD, boxShadow: `0 0 16px ${GOLD}88` }}
              >
                Ping location ↗
              </a>
            </div>
          </Panel>
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <p className={`${display} text-5xl font-bold text-white`} style={{ textShadow: NEON_TEXT_PINK }}>
          GG · WP
        </p>
        <p className={`${hud} text-xs font-bold uppercase tracking-[0.3em] text-white/50`}>made with ♥ by arnav</p>
      </div>
    </section>
  );
}

export default function Invite() {
  const [bursts, setBursts] = useState(0);
  useSnapZone('squad');

  const onAccept = () => {
    haptic([20, 40, 20, 40, 120]);
    readySound();
    setBursts((n) => n + 1);
    setTimeout(() => {
      document.getElementById('briefing')?.scrollIntoView({ behavior: 'smooth' });
    }, 1100);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#07060F] text-white">
        <main className="relative mx-auto max-w-md overflow-x-clip bg-gradient-to-b from-[#07060F] via-[#120B2E] to-[#07060F] pb-10">
          <Hero />
          <Highlights />
          <SquadInvite onAccept={onAccept} />
          <Briefing />
        </main>
      </div>
      {bursts > 0 && <Burst key={bursts} />}
    </MotionConfig>
  );
}
