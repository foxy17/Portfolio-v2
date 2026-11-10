import { Metadata } from 'next';
import { VT323, Roboto_Condensed } from 'next/font/google';
import Invite from './Invite';

const pixel = VT323({ weight: '400', subsets: ['latin'], variable: '--font-pixel' });
const condensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-condensed',
});

export const metadata: Metadata = {
  title: "Aditi & Arnav's Engagement",
  description:
    "You're invited to celebrate Aditi & Arnav's engagement · Friday, 11 December 2026 · Kandivali East, Mumbai.",
  robots: { index: false, follow: false },
  // carnav.in redirects to www; link-preview crawlers don't always follow redirects for images.
  metadataBase: new URL('https://www.carnav.in'),
  openGraph: {
    title: "Aditi & Arnav's Engagement",
    description: "You're invited to celebrate Aditi & Arnav's engagement · Friday, 11 December 2026 · Kandivali East, Mumbai.",
    url: '/engagement-invite',
    type: 'website',
    images: [{ url: '/images/engagement/og.jpg', width: 1200, height: 630, alt: "Aditi & Arnav's Engagement · 11 Dec 2026 · Mumbai" }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function EngagementInvitePage() {
  return (
    <div className={`${pixel.variable} ${condensed.variable}`}>
      <Invite />
    </div>
  );
}
