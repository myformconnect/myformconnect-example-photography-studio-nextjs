export const siteConfig = {
  brand: {
    name: 'Stillframe Studio',
    tagline: 'Photography & Moving Images',
    eyebrow: 'INDEPENDENT PHOTOGRAPHY & FILM STUDIO',
    year: '2026',
    emailPlaceholder: 'hello@stillframestudio.com',
    instagramPlaceholder: 'https://instagram.com/',
    copyright: '© 2026 Stillframe Studio. All rights reserved.',
  },

  hero: {
    headline: 'Real moments. Distinctive frames.',
    copy: 'From intimate celebrations to bold brand stories, we create photographs and films that feel honest, considered, and unmistakably yours.',
    primaryCta: "Let's Talk About Your Project ↗",
    secondaryCta: 'Explore Selected Work ↓',
    image: '/images/hero-editorial.jpg',
    imageAlt: 'Artistic editorial photograph capturing an expressive, cinematic human moment in natural light',
  },

  intro: {
    heading: 'Good work begins with paying attention.',
    copy: 'We believe the best photographs and films come from understanding the people, places, and ideas behind them. Our approach is collaborative, thoughtful, and focused on creating work that feels natural rather than manufactured.',
    disciplines: 'Photography · Films · Creative Direction',
  },

  selectedWork: {
    heading: 'A few ways we tell stories.',
    copy: 'Different people, different settings, the same attention to detail.',
    categories: [
      {
        id: 'weddings',
        number: '01',
        title: 'Weddings & Celebrations',
        description: 'Honest moments and cinematic films from celebrations worth remembering.',
        image: '/images/work-weddings.jpg',
        alt: 'Intimate, emotional moment captured between a couple in authentic morning light',
        aspectRatio: 'portrait',
      },
      {
        id: 'portraits',
        number: '02',
        title: 'Portraits & Fashion',
        description: 'Expressive portraits and visual stories shaped by personality and style.',
        image: '/images/work-portraits.jpg',
        alt: 'Contemporary editorial fashion portrait with sculpted shadows and understated styling',
        aspectRatio: 'landscape',
      },
      {
        id: 'brands',
        number: '03',
        title: 'Brands & Commercial',
        description: 'Photography and films for products, businesses, and creative campaigns.',
        image: '/images/work-brands.jpg',
        alt: 'Clean, tactile product and lifestyle composition with refined earth tones',
        aspectRatio: 'square',
      },
      {
        id: 'events',
        number: '04',
        title: 'Events & Experiences',
        description: 'Thoughtful coverage of gatherings, launches, and live experiences.',
        image: '/images/work-events.jpg',
        alt: 'Atmospheric candid capture of people connecting at a gallery evening',
        aspectRatio: 'landscape',
      },
    ],
  },

  stories: {
    heading: 'Stories Behind the Frame',
    copy: 'Every project begins with a different idea, a different feeling, and a reason to capture it.',
    items: [
      {
        id: 'story-01',
        number: '01',
        title: 'A Day Worth Remembering',
        category: 'WEDDINGS & CELEBRATIONS',
        description: 'The quiet moments, unexpected laughter, and little details that make a celebration personal.',
        image: '/images/story-wedding.jpg',
        alt: 'Atmospheric candid wedding moment with natural golden light',
      },
      {
        id: 'story-02',
        number: '02',
        title: 'In Their Own Light',
        category: 'PORTRAITS & FASHION',
        description: 'Portraits shaped by personality, thoughtful styling, and the beauty of an unforced moment.',
        image: '/images/story-portrait.jpg',
        alt: 'Editorial portrait with natural textures and soft directional lighting',
      },
      {
        id: 'story-03',
        number: '03',
        title: "The Details That Tell a Brand's Story",
        category: 'BRANDS & COMMERCIAL',
        description: 'Carefully composed images that bring a product, a place, or a creative idea to life.',
        image: '/images/story-brand.jpg',
        alt: "Refined product and architectural lifestyle composition bringing a creative brand's idea to life",
      },
    ],
  },

  enquiry: {
    heading: 'Have something in mind?',
    copy: "Tell us a little about what you're creating. We'll take it from there.",
    primaryAction: 'Tell Us About Your Project',
    categories: [
      'Wedding photography & film',
      'Portraits & fashion',
      'Brand & commercial',
      'Event coverage',
      'Other',
    ],
    // Submission endpoint
    endpoint:
      process.env.NEXT_PUBLIC_MYFORMCAPTURE_ENDPOINT ||
      (process.env.NEXT_PUBLIC_MYFORMCAPTURE_FORM_ID
        ? `https://myformcapture.com/f/${process.env.NEXT_PUBLIC_MYFORMCAPTURE_FORM_ID}`
        : 'https://myformcapture.com/f/95dcab67-a579-4a81-9f23-e005ff8204fd'),
    sourceAttribution: 'Stillframe Studio website',
    // Optional booking link
    bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || '',
    bookingLabel: 'Prefer a call? Schedule a conversation.',
  },

  seo: {
    title: 'Stillframe Studio — Photography & Cinematic Films',
    description:
      'Boutique photography and filmmaking studio capturing honest weddings, editorial portraits, and brand stories. Enquire with Stillframe Studio for 2026 dates.',
    canonicalUrl: 'https://stillframestudio.vercel.app',
    siteUrl: 'https://stillframestudio.vercel.app',
    ogImage: '/images/hero-editorial.jpg',
    ogImageAlt: 'Stillframe Studio editorial photography master frame',
    keywords: [
      'photography studio',
      'cinematic wedding films',
      'editorial portrait photography',
      'fashion photography',
      'commercial brand films',
      'event photographer',
      'independent creative studio',
    ],
  },
};
