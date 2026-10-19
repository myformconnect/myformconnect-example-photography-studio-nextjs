export default function manifest() {
  return {
    name: 'Stillframe Studio — Photography & Cinematic Films',
    short_name: 'Stillframe Studio',
    description:
      'Boutique photography and filmmaking studio capturing honest weddings, editorial portraits, and brand stories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#242421',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
