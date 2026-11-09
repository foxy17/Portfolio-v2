import { Metadata } from 'next';
import { Teko, Rajdhani } from 'next/font/google';
import Invite from './Invite';

const display = Teko({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-display' });
const hud = Rajdhani({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-hud' });

export const metadata: Metadata = {
  title: "Arnav & Aditi's Engagement · Match Found",
  description:
    "Squad invite: Arnav & Aditi's engagement · Friday, 11 December 2026 · Kandivali East, Mumbai.",
  robots: { index: false, follow: false },
};

export default function EngagementInvite2Page() {
  return (
    <div className={`${display.variable} ${hud.variable}`}>
      <Invite />
    </div>
  );
}
