import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/siteConfig';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  metadataBase: new URL('https://stillframestudio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: 'https://stillframestudio.com',
    siteName: siteConfig.brand.name,
    images: [
      {
        url: '/images/hero-editorial.jpg',
        width: 1200,
        height: 800,
        alt: siteConfig.hero.imageAlt,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ['/images/hero-editorial.jpg'],
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#F7F5F0',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
