import { Metadata } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import Invite from './Invite';

const display = Barlow_Condensed({ weight: ['500', '600'], subsets: ['latin'], display: 'swap', variable: '--font-display' });
const body = Barlow({ weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata: Metadata = {
  title: "Aditi & Arnav's Engagement · 11 December 2026",
  description:
    "Squad invite: Aditi & Arnav's engagement · Friday, 11 December 2026 · Kandivali East, Mumbai.",
  robots: { index: false, follow: false },
};

export default function EngagementInvite2Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <Invite />
    </div>
  );
}
