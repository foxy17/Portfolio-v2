'use client';

// Shared behaviour for the engagement invite pages (/engagement-invite, /engagement-invite-2).
// Each page owns its look; the scroll/snap mechanics, haptics and sound live here.

import { useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';

// Invisible scroll-snap stop at a given offset inside a relative section (active on phones, see useSnapZone).
export function SnapStop({ top }: { top: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px snap-start snap-always" style={{ top }} />
  );
}

// Phones only: mandatory snap from the top of the page down to the element `endId`
// (hero → 1 swipe → photos → 1 swipe each → endId). From endId down it's free scrolling.
// Hysteresis (on below end − ½vh, off at end) stops it fighting upward scrolls.
export function useSnapZone(endId: string) {
  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia('(max-width: 767px)');
    let on = false;
    const update = () => {
      const endEl = document.getElementById(endId);
      if (!endEl) return;
      const end = endEl.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY;
      const next = mq.matches && (y < end - window.innerHeight / 2 || (on && y < end - 1));
      if (next !== on) {
        on = next;
        html.style.scrollSnapType = on ? 'y mandatory' : '';
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    mq.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      mq.removeEventListener('change', update);
      html.style.scrollSnapType = '';
    };
  }, [endId]);
}

// Pinned section whose vertical scroll drives a horizontal track. Returns refs to attach,
// the 0→1 progress, the track's x, the section height and one snap-stop offset per item.
export function usePinnedStrip(count: number, svhEach: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);
  const { scrollYProgress: progress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(progress, (p) => -p * distance.current);
  const pinnedSvh = count * svhEach - 100;

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track?.parentElement) return;
      distance.current = track.scrollWidth - track.parentElement.clientWidth;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return {
    sectionRef,
    trackRef,
    progress,
    x,
    height: `${count * svhEach}svh`,
    stops: Array.from({ length: count }, (_, i) => `${(i * pinnedSvh) / Math.max(count - 1, 1)}svh`),
  };
}

// Progress range around item `index` of `count` in a strip: [prev centre, own centre, next centre].
export function focusRange(index: number, count: number) {
  const span = 1 / Math.max(count - 1, 1);
  const center = index * span;
  return [center - span, center, center + span];
}

// Tap feedback. Android: Vibration API. iOS Safari has no vibrate(), but toggling a
// native <input switch> fires the system haptic (iOS 18+), so click a hidden one.
export function haptic(pattern: number[] = [30, 60, 30, 60, 80]) {
  if (typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
    return;
  }
  const label = document.createElement('label');
  label.ariaHidden = 'true';
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.body.appendChild(label);
  label.click();
  label.remove();
}

// Synthesised notes via Web Audio; no audio files. Silently does nothing if audio is unavailable.
let audioCtx: AudioContext | null = null;
export function playTones(
  notes: { freq: number; at: number; dur: number; endFreq?: number }[],
  { type = 'square', volume = 0.08 }: { type?: OscillatorType; volume?: number } = {},
) {
  try {
    audioCtx ??= new AudioContext();
    void audioCtx.resume();
    const ctx = audioCtx;
    const t0 = ctx.currentTime;
    for (const { freq, at, dur, endFreq } of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      const t = t0 + at;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }
  } catch {
    // Audio unavailable (old browser / blocked).
  }
}
