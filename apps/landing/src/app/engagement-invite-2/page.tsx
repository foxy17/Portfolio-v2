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
  // carnav.in redirects to www; link-preview crawlers don't always follow redirects for images.
  metadataBase: new URL('https://www.carnav.in'),
  openGraph: {
    title: "Aditi & Arnav's Engagement · 11 December 2026",
    description: "Squad invite: Aditi & Arnav's engagement · Friday, 11 December 2026 · Kandivali East, Mumbai.",
    url: '/engagement-invite-2',
    type: 'website',
    images: [{ url: '/images/engagement-2/og.jpg', width: 1200, height: 630, alt: "Match found: Aditi & Arnav's Engagement · 11.12.2026 · Mumbai" }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function EngagementInvite2Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <Invite />
    </div>
  );
}
