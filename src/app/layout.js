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
  metadataBase: new URL('https://stillframestudio.vercel.app'),
  alternates: {
    canonical: 'https://stillframestudio.vercel.app',
  },
  authors: [{ name: siteConfig.brand.name, url: 'https://stillframestudio.vercel.app' }],
  creator: siteConfig.brand.name,
  publisher: siteConfig.brand.name,
  keywords: siteConfig.seo.keywords,
  category: 'photography',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: 'https://stillframestudio.vercel.app',
    siteName: siteConfig.brand.name,
    images: [
      {
        url: '/images/hero-editorial.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: siteConfig.seo.ogImageAlt,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: '/images/hero-editorial.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.seo.ogImageAlt,
      },
    ],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#F7F5F0',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.brand.name,
  url: 'https://stillframestudio.vercel.app',
  image: 'https://stillframestudio.vercel.app/images/hero-editorial.jpg',
  description: siteConfig.seo.description,
  sameAs: [siteConfig.brand.instagramPlaceholder],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <meta name="google-site-verification" content="G6260ua08PUBGFeIVXoiVPpZTfH-Lyfyl2FyCYKrqIo" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
