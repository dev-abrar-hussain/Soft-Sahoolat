import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://soft.sahoolat.pk'),
  title: { default: 'WooFeeds Pro — WooCommerce Product Feeds', template: '%s — WooFeeds Pro' },
  description: 'Generate scheduled WooCommerce product feeds for Google Merchant Center, Meta Commerce Manager and ChatGPT.',
  icons: { icon: '/assets/logo.svg' },
  openGraph: { siteName: 'WooFeeds Pro', images: ['/assets/social-card.svg'] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
