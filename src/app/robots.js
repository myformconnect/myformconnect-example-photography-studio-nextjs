export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://stillframestudio.vercel.app/sitemap.xml',
    host: 'https://stillframestudio.vercel.app',
  };
}
