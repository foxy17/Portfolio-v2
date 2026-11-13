'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MotionConfig, motion, useInView, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { RsvpDialog } from '~/lib/rsvp';
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

function DotaMark() {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className="h-8 w-8 shrink-0 fill-current">
      <path fillRule="evenodd" d="M3 2 30 4 29 30 2 28Zm5 5 3 9 14 9-7-12Zm12 0 6 6V7ZM7 21v5h6Z" />
    </svg>
  );
}

function ApexMark() {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className="h-6 w-6 shrink-0 fill-current">
      <path d="m16 2 14 25H20l-4-7-4 7H2Zm0 10-5 10h2l3-6 3 6h2ZM12 29h8l-4 3Z" />
    </svg>
  );
}

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

        <div className="invite-hero-players relative mt-[3svh]">
          <p className="mb-3 text-base text-[#d2cdbf]">Player two. For life.</p>
          <h1 className={`${heading} text-[#f3eddf]!`}>
            <span className="sr-only">Aditi &amp; Arnav</span>
            <span aria-hidden className="relative grid grid-cols-2 gap-4">
              {['Aditi', 'Arnav'].map((name, index) => (
                <span key={name} className={`block min-w-0 ${name === 'Arnav' ? 'text-[#efa16f]' : 'text-[#c4adeb]'}`}>
                  <span className="relative block aspect-[4/5] max-h-[26svh] overflow-hidden border border-current bg-[#282b24] [clip-path:polygon(0_0,100%_0,100%_94%,92%_100%,0_100%)]">
                    <Image
                      src={`/images/engagement-2/p-${name.toLowerCase()}.webp`}
                      alt=""
                      fill
                      loading="eager"
                      sizes="(max-width: 448px) 40vw, 188px"
                      className="object-cover object-center"
                    />
                    <span className={`${hud} absolute left-2 top-2 border border-current bg-[#24252d] px-1.5 py-1 font-normal tracking-normal`}>P0{index + 1}</span>
                    <span className={`${display} absolute bottom-0 inset-x-0 bg-[#1b1d19]/95 px-2 py-2 text-2xl font-semibold tracking-normal text-current`}>
                      {name.toUpperCase()}
                    </span>
                  </span>
                  <span className="mt-1.5 grid gap-1 font-mono text-[10px] font-normal leading-tight tracking-normal">
                    {[['DUO', 'A + A'], ['QUEST', 'FOREVER'], ['STATUS', 'READY ✓']].map(([label, value]) => (
                      <span key={label} className="flex justify-between gap-1 border-l-2 border-current bg-[#1b1d19] px-2 py-1">
                        <span className="text-[#b9b9ab]">{label}</span><span>{value}</span>
                      </span>
                    ))}
                  </span>
                </span>
              ))}
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
      <div className="absolute inset-x-0 border-y border-[#a8c5ad] bg-[#1b1d19] px-4 py-7 text-center">
        <p className={`${display} text-[clamp(2rem,9vw,3rem)] font-semibold text-[#a8c5ad]`}>RADIANT VICTORY</p>
        <p className={`${hud} mt-2 text-[#f3eddf]`}>YOU’RE IN.</p>
      </div>
      {!reducedMotion && bits.map((bit, i) => (
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

// three.js (~150 KB gzip) + the scene load only once the squad section is near, not with the
// page (next/dynamic would preload the chunk up front).
type TitanSceneComponent = typeof import('./TitanScene').default;
function useTitanScene(near: boolean) {
  const [Scene, setScene] = useState<TitanSceneComponent | null>(null);
  useEffect(() => {
    if (!near || Scene) return;
    let live = true;
    import('./TitanScene').then((m) => live && setScene(() => m.default));
    return () => { live = false; };
  }, [near, Scene]);
  return Scene;
}
type TitanPhase = 'idle' | 'drop' | 'walk' | 'punch' | 'impact';
const LAND_AT = 0.35;
const LAND_IMPACT = LAND_AT;
const OPTIC_AT = 1.35;
const RISE_AT = 1.65;
const DROP_SECONDS = 2.75;
const STEP_SECONDS = 1;
const WALK_LOOPS = 2;
const WALK_SECONDS = WALK_LOOPS * 2 * STEP_SECONDS;
const PULL_START = 0;
const COIL_START = 0.7;
const STRIKE_START = COIL_START + 0.25;
const IMPACT_AT = STRIKE_START + 0.2;
const IMPACT_HOLD = 0.05;
const TIMELINE = { LAND_AT, OPTIC_AT, RISE_AT, DROP_SECONDS, STEP_SECONDS, WALK_SECONDS, COIL_START, STRIKE_START, IMPACT_AT, IMPACT_HOLD };

let sfxCtx: AudioContext | null = null;
let sfxMaster: GainNode | null = null;
type TitanAudio = { ctx: AudioContext; bus: GainNode; sources: Set<AudioScheduledSourceNode> };
async function unlockAudio() {
  try {
    sfxCtx ??= new AudioContext();
    await sfxCtx.resume();
    if (sampleBytes.size === SAMPLE_NAMES.length) await loadSamples(sfxCtx);
    return true;
  } catch {
    return false;
  }
}
function ctxReady(): TitanAudio | null {
  if (!sfxCtx || sfxCtx.state !== 'running') return null;
  const ctx = sfxCtx;
  if (!sfxMaster) {
    sfxMaster = ctx.createGain();
    sfxMaster.gain.value = 0.65;
    const grit = ctx.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(1.3 * x) / Math.tanh(1.3); // light grit; recorded clips stay clean
    }
    grit.curve = curve;
    grit.oversample = '2x';
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.knee.value = 6;
    limiter.ratio.value = 16;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.28;
    sfxMaster.connect(grit).connect(limiter).connect(ctx.destination);
  }
  const bus = ctx.createGain();
  bus.connect(sfxMaster);
  return { ctx, bus, sources: new Set() };
}
function envGain(audio: TitanAudio, at: number, peak: number, attack: number, decay: number, pan = 0) {
  const g = audio.ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  const panner = audio.ctx.createStereoPanner();
  panner.pan.value = pan;
  g.connect(panner).connect(audio.bus);
  return { g, panner };
}
function tone(audio: TitanAudio, at: number, type: OscillatorType, f0: number, f1: number, dur: number, peak: number,
  { attack = 0.005, cutoff = 1400, cutoffEnd = cutoff, detune = 0, vibrato = 0, pan = 0 }:
  { attack?: number; cutoff?: number; cutoffEnd?: number; detune?: number; vibrato?: number; pan?: number } = {}) {
  const { ctx } = audio;
  if (at < ctx.currentTime) return;
  const o = ctx.createOscillator();
  o.type = type;
  o.detune.value = detune;
  o.frequency.setValueAtTime(f0, at);
  o.frequency.exponentialRampToValueAtTime(f1, at + dur);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, at);
  filter.frequency.exponentialRampToValueAtTime(cutoffEnd, at + dur);
  const { g, panner } = envGain(audio, at, peak, attack, dur, pan);
  o.connect(filter).connect(g);
  const nodes: AudioNode[] = [o, filter, g, panner];
  if (vibrato) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 7;
    depth.gain.value = vibrato;
    lfo.connect(depth).connect(o.frequency);
    nodes.push(lfo, depth);
    audio.sources.add(lfo);
    lfo.onended = () => { audio.sources.delete(lfo); };
    lfo.start(at);
    lfo.stop(at + attack + dur + 0.04);
  }
  audio.sources.add(o);
  o.onended = () => {
    audio.sources.delete(o);
    nodes.forEach((node) => node.disconnect());
  };
  o.start(at);
  o.stop(at + attack + dur + 0.04);
}
// Recorded CC0 clips from Freesound (robot footsteps, structure collision, bass impact,
// mech power-up, air release, servo, mechanical clamp, glass break), trimmed and pitched
// down for weight in /public/sfx/bt. Synth sub-bass is layered under the big hits.
const SAMPLE_NAMES = ['step-1', 'step-2', 'step-3', 'fall', 'land', 'powerup', 'hiss', 'servo', 'clamp', 'impact'] as const;
type SampleName = (typeof SAMPLE_NAMES)[number];
const samples = new Map<SampleName, AudioBuffer>();
const sampleBytes = new Map<SampleName, ArrayBuffer>();
const sampleProgress = new Set<(progress: number) => void>();
let samplesFetching: Promise<void> | null = null;
let samplesLoading: Promise<void> | null = null;
function fetchSamples(onProgress?: (progress: number) => void) {
  if (onProgress) {
    sampleProgress.add(onProgress);
    onProgress(sampleBytes.size / SAMPLE_NAMES.length);
  }
  samplesFetching ??= Promise.all(SAMPLE_NAMES.map(async (name) => {
    if (sampleBytes.has(name)) return;
    const res = await fetch(`/sfx/bt/${name}.mp3`);
    if (!res.ok) throw new Error(`BT sound unavailable: ${name}`);
    const bytes = await res.arrayBuffer();
    if (!bytes.byteLength) throw new Error(`Empty BT sound: ${name}`);
    sampleBytes.set(name, bytes);
    sampleProgress.forEach((notify) => notify(sampleBytes.size / SAMPLE_NAMES.length));
  })).then(() => undefined).catch((error) => { samplesFetching = null; throw error; });
  return samplesFetching.finally(() => { if (onProgress) sampleProgress.delete(onProgress); });
}
function loadSamples(ctx: AudioContext) {
  samplesLoading ??= fetchSamples().then(() => Promise.all(SAMPLE_NAMES.map(async (name) => {
    if (!samples.has(name)) samples.set(name, await ctx.decodeAudioData(sampleBytes.get(name)!.slice(0)));
  }))).then(() => undefined).catch((error) => { samplesLoading = null; throw error; });
  return samplesLoading;
}
function sample(audio: TitanAudio, name: SampleName, at: number, gain = 1, until = Infinity, fade = 0.03) {
  const buffer = samples.get(name);
  const now = audio.ctx.currentTime;
  const start = Math.max(at, now);
  const end = Math.min(at + (buffer?.duration ?? 0), until);
  if (!buffer || end <= start) return;
  const src = audio.ctx.createBufferSource();
  src.buffer = buffer;
  const g = audio.ctx.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.setValueAtTime(gain, Math.max(start, end - fade));
  g.gain.linearRampToValueAtTime(0, end);
  src.connect(g).connect(audio.bus);
  audio.sources.add(src);
  src.onended = () => { audio.sources.delete(src); src.disconnect(); g.disconnect(); };
  src.start(start, Math.max(0, now - at));
  src.stop(end);
}
const titanSfx = {
  play(elapsed = 0) {
    const audio = ctxReady();
    if (!audio) return;
    const t0 = audio.ctx.currentTime - elapsed;
    this.drop(audio, t0);
    this.walk(audio, t0 + DROP_SECONDS);
    this.punch(audio, t0 + DROP_SECONDS + WALK_SECONDS);
    return () => {
      audio.bus.gain.setValueAtTime(0, audio.ctx.currentTime);
      audio.sources.forEach((source) => source.stop());
      audio.bus.disconnect();
    };
  },
  drop(audio: TitanAudio, at: number) {
    sample(audio, 'fall', at + LAND_AT - 0.6, 0.8, at + LAND_AT + 0.2); // Peak at touchdown, including the initial buffer offset.
    const hit = at + LAND_IMPACT;
    sample(audio, 'land', at + LAND_AT, 1, at + DROP_SECONDS);
    tone(audio, hit, 'sine', 45, 25, 1.6, 0.6); // sub-bass under the landing
    sample(audio, 'powerup', at + OPTIC_AT - 1.9, 0.75, at + DROP_SECONDS, 0.1);
    sample(audio, 'hiss', at + RISE_AT, 0.6, at + DROP_SECONDS, 0.1);
  },
  walk(audio: TitanAudio, at: number) {
    for (let i = 0; i < WALK_LOOPS * 2; i++) {
      const step = at + (i + 1) * STEP_SECONDS;
      const near = 0.6 + i * 0.13; // louder as BT gets closer
      sample(audio, (['step-1', 'step-2', 'step-3'] as const)[i % 3], step, near, step + 0.46);
    }
  },
  punch(audio: TitanAudio, at: number) {
    sample(audio, 'servo', at + PULL_START, 0.7, at + STRIKE_START, 0.15);
    sample(audio, 'clamp', at + COIL_START, 0.8);
    sample(audio, 'impact', at + IMPACT_AT, 1);
    tone(audio, at + IMPACT_AT, 'sine', 48, 24, 1.5, 0.7);
  },
};

const SHARDS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 3) * 0.3;
  const dist = 260 + (i % 5) * 70;
  const size = 26 + (i % 4) * 18;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: (i % 2 ? 1 : -1) * (120 + i * 23),
    size,
    shape: i % 3 === 0 ? '50% 0, 100% 100%, 0 70%' : i % 3 === 1 ? '0 0, 100% 30%, 40% 100%' : '20% 0, 100% 60%, 0 100%',
  };
});

// Radiating crack lines from the impact point, in a 200x200 viewBox centred at (100,100).
const CRACKS = Array.from({ length: 11 }, (_, i) => {
  const a = (i / 11) * Math.PI * 2 + (i % 2) * 0.2;
  const r1 = 18 + (i % 3) * 6;
  const r2 = 60 + (i % 4) * 22;
  const r3 = 120 + (i % 3) * 30;
  const kink = (i % 2 ? 0.18 : -0.15);
  return `M${100 + Math.cos(a) * 6} ${100 + Math.sin(a) * 6} L${100 + Math.cos(a) * r1} ${100 + Math.sin(a) * r1} L${100 + Math.cos(a + kink) * r2} ${100 + Math.sin(a + kink) * r2} L${100 + Math.cos(a - kink / 2) * r3} ${100 + Math.sin(a - kink / 2) * r3}`;
});
const RINGS = [24, 46].map((r) => {
  const pts = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2;
    const rr = r + (i % 2 ? 5 : -3);
    return `${100 + Math.cos(a) * rr} ${100 + Math.sin(a) * rr}`;
  });
  return `M${pts.join(' L')} Z`;
});

function GlassBreak() {
  return (
    <>
      <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }} />
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-[42%] h-[140vw] max-h-[620px] w-[140vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        {[...CRACKS, ...RINGS].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#f3eddf"
            strokeOpacity={0.85}
            strokeWidth={i < CRACKS.length ? 0.9 : 0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        ))}
      </motion.svg>
      <div className="absolute left-1/2 top-[42%]">
        {SHARDS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute block bg-[#f3eddf]/25"
            style={{ width: s.size, height: s.size, clipPath: `polygon(${s.shape})`, border: '1px solid #f3eddf88' }}
            initial={{ x: -s.size / 2, y: -s.size / 2, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{ x: s.x, y: s.y + 160, opacity: 0, rotate: s.rotate, scale: 1.3 }}
            transition={{ duration: 1.1, ease: [0.15, 0.7, 0.4, 1] }}
          />
        ))}
      </div>
    </>
  );
}

function SquadInvite({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const closeRsvp = useCallback(() => setRsvpOpen(false), []);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.5, once: true });
  const near = useInView(sectionRef, { margin: '800px 0px', once: true });
  const TitanScene = useTitanScene(near);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TitanPhase>('idle');
  const [run, setRun] = useState(0);
  const [modelProgress, setModelProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const ready = modelReady && audioReady && !loadFailed;
  const progress = Math.floor((modelProgress + audioProgress) * 50);
  const onModelReady = useCallback(() => { setModelProgress(1); setModelReady(true); }, []);
  const withSound = useRef(false);
  const deploying = useRef(false);
  // "Standby for Titanfall": the intro starts on a tap (browsers only allow sound after
  // one). If nobody taps within a few seconds it starts anyway, silently.
  useEffect(() => {
    if (!inView || run > 0 || !ready || preparing || phase !== 'idle') return;
    if (reducedMotion) return setPhase('impact');
    const t = setTimeout(() => { withSound.current = false; setRun(1); }, 5000);
    return () => clearTimeout(t);
  }, [inView, reducedMotion, run, ready, preparing, phase]);
  const deploy = async () => {
    if (loadFailed) {
      setLoadFailed(false);
      setModelProgress(0);
      setModelReady(false);
      setAudioReady(false);
      setRun(0);
      setPhase('idle');
      return;
    }
    if (deploying.current || !ready) return;
    deploying.current = true;
    setPreparing(true);
    const unlocked = await unlockAudio();
    setPreparing(false);
    if (!unlocked) { onSceneError(); return; }
    withSound.current = true;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setRun((n) => n + 1);
  };
  const stopAudio = useRef<(() => void) | undefined>(undefined);
  const onPlayback = useCallback((elapsed: number, playing: boolean) => {
    stopAudio.current?.();
    stopAudio.current = playing && withSound.current ? titanSfx.play(elapsed) : undefined;
  }, []);
  const onTime = useCallback((elapsed: number) => {
    const punchAt = DROP_SECONDS + WALK_SECONDS;
    setPhase(elapsed >= punchAt + IMPACT_AT ? 'impact' : elapsed >= punchAt ? 'punch' : elapsed >= DROP_SECONDS ? 'walk' : 'drop');
  }, []);
  const onSceneError = useCallback(() => {
    stopAudio.current?.();
    stopAudio.current = undefined;
    deploying.current = false;
    setLoadFailed(true);
    setPhase('impact');
  }, []);
  useEffect(() => {
    if (!near || reducedMotion || loadFailed) return;
    let active = true;
    fetchSamples((value) => { if (active) setAudioProgress(value); })
      .then(() => sfxCtx ? loadSamples(sfxCtx) : undefined)
      .then(() => { if (active) setAudioReady(true); })
      .catch(() => { if (active) onSceneError(); });
    return () => { active = false; };
  }, [near, reducedMotion, loadFailed, onSceneError]);
  useEffect(() => {
    deploying.current = false;
    if (reducedMotion) setPhase('impact');
    else if (run > 0) setPhase('drop');
    return () => { stopAudio.current?.(); stopAudio.current = undefined; };
  }, [reducedMotion, run]);
  const revealed = phase === 'impact';

  return (
    <section ref={sectionRef} id="squad" className="relative isolate min-h-svh snap-start snap-always overflow-clip bg-[#100f13]" aria-labelledby="squad-title">
      {!reducedMotion && near && !loadFailed && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh overflow-hidden">
          {TitanScene && <TitanScene run={run} timeline={TIMELINE} onTime={onTime} onPlayback={onPlayback} onError={onSceneError} onProgress={setModelProgress} onReady={onModelReady} />}
          {phase === 'impact' && <GlassBreak />}
        </div>
      )}
      {phase === 'idle' && !ready && !reducedMotion && (
        <div className="absolute inset-x-0 top-0 flex h-svh flex-col items-center justify-center gap-6 bg-[#100f13] px-7 text-[#f3eddf]">
          <style>{`@keyframes titan-link { to { transform: rotate(360deg); } }`}</style>
          <div aria-hidden className="relative flex h-20 w-20 items-center justify-center text-[#a8c5ad]">
            <div className="absolute inset-0 animate-[titan-link_3s_linear_infinite] rounded-full border border-[#a8c5ad]/30 border-r-[#efa16f] border-t-[#a8c5ad]" />
            <span className="font-mono text-2xl">+</span>
          </div>
          <div className="text-center">
            <p className={`${hud} mb-3 text-[#efa16f]`}>TITAN INBOUND</p>
            <p className={`${hud} text-[#d2cdbf]`}>ESTABLISHING NEURAL LINK</p>
          </div>
          <div className="w-full max-w-xs">
            <div role="progressbar" aria-label="Loading titan and sound clips" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-1 overflow-hidden bg-[#f3eddf]/15">
              <div className="h-full origin-left bg-[#a8c5ad]" style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
            <p className={`${hud} mt-3 text-right text-[#a8c5ad]`}>{progress}%</p>
          </div>
        </div>
      )}
      {phase === 'idle' && ready && inView && !reducedMotion && (
        <div className="absolute inset-x-0 top-0 flex h-svh flex-col items-center justify-center gap-3">
          <p className={`${hud} text-[#b9b9ab]`}>INCOMING TRANSMISSION</p>
          <button
            type="button"
            onClick={deploy}
            disabled={preparing}
            className={`${display} ${focus} cursor-pointer border border-[#a8c5ad] px-6 py-3 text-3xl font-semibold text-[#a8c5ad] transition-colors hover:bg-[#a8c5ad] hover:text-[#100f13] focus-visible:outline-[#c4adeb]`}
          >
            STANDBY FOR TITANFALL
          </button>
          <p className={`${hud} text-[#b9b9ab]`}>TAP · SOUND ON 🔊</p>
        </div>
      )}
      {/* Screen shake on impact. */}
      <motion.div
        className="flex min-h-svh flex-col justify-center px-7 py-16"
        animate={revealed && !reducedMotion ? { x: [0, -10, 9, -6, 4, 0], y: [0, 6, -5, 3, 0, 0] } : undefined}
        transition={{ duration: 0.4 }}
      >
      {/* The invite rises out of BT's open hand. */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.4, y: 220 }}
        animate={revealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.4, y: 220 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 16, delay: 0.35 }}
        style={{ transformOrigin: '50% 100%', pointerEvents: revealed ? 'auto' : 'none' }}
        inert={!revealed}
        aria-hidden={!revealed}
      >
      <div className={`${hud} mb-6 flex items-center justify-between border-b border-[#f3eddf]/25 pb-4`}>
        <span>02 / SQUAD INVITE</span>
        <span className="text-[#a8c5ad]">READY CHECK</span>
      </div>
      <div className="mb-8">
        <div className={`${display} mb-3 flex items-center gap-2 text-xl font-semibold text-[#f3eddf]`}>
          <ApexMark /><span>YOUR SQUAD</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['ADITI', 'ARNAV'].map((name) => (
            <div key={name} className={`min-w-0 border-t-2 bg-[#24252d] p-3 ${name === 'ADITI' ? 'border-[#c4adeb] text-[#c4adeb]' : 'border-[#efa16f] text-[#efa16f]'}`}>
              <p className={`${display} text-2xl font-semibold`}>{name}</p>
              <p className="mt-2 font-mono text-[10px] text-[#f3eddf]">READY ✓</p>
            </div>
          ))}
          <div className="flex min-w-0 flex-col items-center justify-center border border-dashed border-[#a8c5ad] bg-[#232b29] px-1 py-3 text-[#a8c5ad]">
            <span aria-hidden className="text-xl leading-none">{accepted ? '✓' : '+'}</span>
            <p className={`${display} mt-1 text-xl font-semibold`}>YOU</p>
            <p className="mt-1 font-mono text-[9px]">{accepted ? 'READY' : 'OPEN SLOT'}</p>
          </div>
        </div>
      </div>
      <p className={`${hud} mb-5 uppercase leading-relaxed text-[#d2cdbf]`}>With the love and blessings of their families</p>
      <h2 id="squad-title" className={`${heading} text-[clamp(3.5rem,16vw,4.5rem)]! leading-[0.94]! text-[#f3eddf]!`}>
        <span className="text-[#c4adeb]">ADITI</span> &amp; <span className="text-[#efa16f]">ARNAV</span>
      </h2>
      <p className={`${display} mt-3 text-[2rem] font-medium uppercase leading-none text-[#a8c5ad]`}>are unlocking a new chapter!</p>
      <p className="mb-8 mt-6 max-w-[20rem] text-base leading-relaxed text-[#d2cdbf]">
        We invite you to celebrate as we level up to our next adventure together!
      </p>
      <div className="border border-[#a8c5ad]/60 bg-[#1b1d19] p-4 shadow-[inset_0_2px_0_#a8c5ad]">
        <div className="mb-5 flex items-center gap-3 text-[#a8c5ad]">
          <DotaMark />
          <div>
            <p className={`${hud} text-[#b9b9ab]`}>MATCH FOUND</p>
            <p className={`${display} text-[1.75rem] font-semibold leading-tight`}>YOUR GAME IS READY</p>
          </div>
        </div>
        <dl className={`${hud} mb-5 grid grid-cols-2 border-y border-[#f3eddf]/25 py-4`}>
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
          onClick={() => setRsvpOpen(true)}
          className={`${display} ${focus} relative flex min-h-20 w-full cursor-pointer items-center justify-between border border-[#a8c5ad] bg-[#a8c5ad] px-5 text-4xl font-semibold text-[#1b1d19] transition-[background-color,transform] hover:bg-[#bfd8c3] active:translate-y-0.5 focus-visible:outline-[#c4adeb] disabled:cursor-default disabled:border-[#c4adeb] disabled:bg-[#302936] disabled:text-[#c4adeb] motion-reduce:transition-none`}
        >
          <span>{accepted ? 'ACCEPTED' : 'ACCEPT'}</span>
          <span aria-hidden className="text-3xl">✓</span>
        </button>
        {!accepted && (
          <button
            type="button"
            onClick={() => setRsvpOpen(true)}
            className={`${display} ${focus} mt-3 flex min-h-14 w-full cursor-pointer items-center justify-center border border-[#c4adeb] px-5 text-3xl font-semibold text-[#c4adeb] transition-[background-color,transform] hover:bg-[#302936] active:translate-y-0.5 focus-visible:outline-[#c4adeb] motion-reduce:transition-none`}
          >
            ALSO ACCEPT
          </button>
        )}
        <RsvpDialog
          open={rsvpOpen}
          invite="invite-2"
          theme="hud"
          title="Join the squad"
          onClose={closeRsvp}
          onSaved={() => { setRsvpOpen(false); setAccepted(true); onAccept(); }}
        />
        <div aria-hidden className="mt-2 h-1 bg-[#f3eddf]/15">
          {accepted && <motion.div className="h-full origin-left bg-[#c4adeb]" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 1.1, ease: 'linear' }} />}
        </div>
        <p aria-live="polite" className="mt-4 min-h-5 text-center text-xs text-[#b9b9ab]">
          {accepted ? 'You’re in. Opening the briefing in 1 second…' : 'We’d love to celebrate with you.'}
        </p>
      </div>
      {!reducedMotion && (
        <button
          type="button"
          onClick={deploy}
          className={`${hud} ${focus} mx-auto mt-8 flex cursor-pointer items-center gap-2 border border-[#f3eddf]/30 px-4 py-3 text-[#d2cdbf] transition-colors hover:border-[#f3eddf]/60 hover:text-[#f3eddf] focus-visible:outline-[#c4adeb]`}
        >
          <span aria-hidden>↻</span> REPLAY INTRO
        </button>
      )}
      </motion.div>
      </motion.div>
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
        <div className={`${display} flex items-center gap-3 bg-[#a8c5ad] px-3 py-3 text-[#1b1d19]`}>
          <ApexMark />
          <span className="text-xl font-semibold leading-none">DROPPING AT CLUB HOUSE</span>
        </div>
        <div className={`${hud} flex items-center justify-between border-b border-[#f3eddf]/25 px-3 py-3`}>
          <span className="text-[#a8c5ad]">DROP ZONE / MUMBAI</span>
          <span className="text-[#b9b9ab]">01</span>
        </div>
        <div className="relative aspect-square overflow-hidden bg-[#282b24]">
          <Image src="/images/engagement-2/minimap.webp" alt="Dota 2 style minimap with the venue marked in the centre" fill sizes="(max-width: 448px) 85vw, 392px" className="object-cover" />
          <div aria-hidden className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <svg viewBox="0 0 48 60" className="h-16 w-12 text-[#efa16f]">
              <path d="M24 2 46 24 24 58 2 24Z" fill="#1b1d19" stroke="currentColor" strokeWidth="3" />
              <path d="m24 13 11 11-11 11-11-11Z" fill="currentColor" />
              <path d="M24 36v12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className={`${hud} mt-2 whitespace-nowrap bg-[#1b1d19] px-3 py-2 text-[#efa16f]`}>PING: CLUB HOUSE</span>
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
        <a href="https://sketchfab.com/3d-models/bt-7274-934abf35aeb84d128ffba1eadbc4aed5" target="_blank" rel="noopener noreferrer" className={`${focus} mt-3 inline-block text-xs text-[#b9b9ab] underline underline-offset-4`}>
          BT-7274 model by Palurdas Arts · CC BY 4.0
        </a>
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
  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

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
