'use client';

// RSVP popup shared by both engagement invites: name + party size, saved via /api/rsvp.
// Each invite passes its own look; the device id lets a guest update their answer.

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

type Invite = 'invite-1' | 'invite-2';
type Saved = { name: string; guests: number };

const THEMES = {
  pixel: {
    overlay: 'bg-[#0C327D]/45',
    card: 'border-[3px] border-[#0C327D] bg-[#FDE9F7] text-[#0C327D] shadow-[6px_6px_0_#0C327D]',
    title: 'font-[family-name:var(--font-pixel)]! font-normal! text-4xl! leading-none',
    label: 'font-[family-name:var(--font-pixel)] text-lg uppercase tracking-wider',
    input: 'border-2 border-[#0C327D] bg-white text-[#0C327D] font-[family-name:var(--font-condensed)] text-lg',
    step: 'border-2 border-[#0C327D] bg-white font-[family-name:var(--font-pixel)] text-2xl shadow-[3px_3px_0_#0C327D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
    count: 'font-[family-name:var(--font-pixel)] text-4xl',
    submit: 'border-2 border-[#0C327D] bg-[#FF7AC8] text-white font-[family-name:var(--font-pixel)] text-2xl shadow-[3px_3px_0_#0C327D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
    cancel: 'font-[family-name:var(--font-pixel)] text-lg underline',
    error: 'text-[#D61F69]',
  },
  hud: {
    overlay: 'bg-[#100f13]/80',
    card: 'border border-[#a8c5ad]/60 bg-[#1b1d19] text-[#f3eddf] shadow-[inset_0_2px_0_#a8c5ad]',
    title: 'font-[family-name:var(--font-display)]! font-semibold! text-4xl! uppercase leading-none',
    label: 'font-mono text-xs uppercase text-[#b9b9ab]',
    input: 'border border-[#f3eddf]/30 bg-[#24252d] text-[#f3eddf] text-base focus:border-[#a8c5ad]',
    step: 'border border-[#f3eddf]/30 font-[family-name:var(--font-display)] text-3xl text-[#a8c5ad] active:bg-[#24252d]',
    count: 'font-[family-name:var(--font-display)] text-5xl font-semibold',
    submit: 'border border-[#a8c5ad] bg-[#a8c5ad] text-[#1b1d19] font-[family-name:var(--font-display)] text-3xl font-semibold uppercase',
    cancel: 'font-mono text-xs uppercase text-[#b9b9ab] underline',
    error: 'text-[#efa16f]',
  },
};

function storage<T>(key: string, value?: T): T | null {
  try {
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// A guest who already RSVP'd on this device skips straight to the details next visit.
export const hasRsvp = () => storage<Saved>('rsvp') !== null;

function deviceId() {
  const existing = storage<string>('rsvp-device');
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage('rsvp-device', id);
  return id;
}

export function RsvpDialog({
  open,
  invite,
  theme,
  title,
  onClose,
  onSaved,
}: {
  open: boolean;
  invite: Invite;
  theme: keyof typeof THEMES;
  title: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = THEMES[theme];
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  // Prefill a returning guest's previous answer.
  useEffect(() => {
    if (!open) return;
    const saved = storage<Saved>('rsvp');
    if (saved) {
      setName(saved.name);
      setGuests(saved.guests);
    }
    setStatus('idle');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return inputRef.current?.focus();
    setStatus('saving');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, guests, invite, deviceId: deviceId() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      storage<Saved>('rsvp', { name: trimmed, guests });
      onSaved();
    } catch {
      setStatus('error');
    }
  };

  // Portal to the invite's root (it carries the page's font variables) rather than inside
  // the section: transformed motion ancestors would otherwise break `position: fixed`.
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center ${t.overlay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            onSubmit={submit}
            className={`w-full max-w-sm space-y-5 p-5 ${t.card}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <h2 id="rsvp-title" className={`${t.title} text-current!`}>
              {title}
            </h2>
            <label className="block space-y-2">
              <span className={t.label}>Your name</span>
              <input
                ref={inputRef}
                autoFocus
                required
                maxLength={80}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full px-3 py-2 outline-none ${t.input}`}
              />
            </label>
            <div className="space-y-2">
              <span className={t.label}>Number of people (incl. you)</span>
              <div className="flex items-center justify-between">
                <button type="button" aria-label="Fewer people" disabled={guests <= 1} onClick={() => setGuests((g) => Math.max(1, g - 1))} className={`h-12 w-12 disabled:opacity-40 ${t.step}`}>
                  −
                </button>
                <span aria-live="polite" className={t.count}>
                  {guests}
                </span>
                <button type="button" aria-label="More people" disabled={guests >= 10} onClick={() => setGuests((g) => Math.min(10, g + 1))} className={`h-12 w-12 disabled:opacity-40 ${t.step}`}>
                  +
                </button>
              </div>
            </div>
            {status === 'error' && <p className={`text-sm ${t.error}`}>Couldn’t save that. Check your connection and try again.</p>}
            <button type="submit" disabled={status === 'saving'} className={`block w-full py-3 disabled:opacity-60 ${t.submit}`}>
              {status === 'saving' ? 'Saving…' : 'Confirm'}
            </button>
            <button type="button" onClick={onClose} className={`mx-auto block ${t.cancel}`}>
              Not yet
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('invite-root') ?? document.body,
  );
}
