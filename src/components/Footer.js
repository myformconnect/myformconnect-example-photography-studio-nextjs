'use client';

import { siteConfig } from '@/lib/siteConfig';
import NewsletterForm from '@/components/NewsletterForm';
import { openContactModal } from '@/components/GlobalModals';

export default function Footer() {
  const { brand } = siteConfig;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Newsletter */}
        <div className="footer-top-newsletter">
          <NewsletterForm />
        </div>

        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-title">{brand.name}</span>
            <span className="footer-tagline">{brand.tagline}</span>
          </div>

          <div className="footer-links">
            <button
              type="button"
              onClick={openContactModal}
              className="footer-text-btn"
              id="footer-contact-btn"
            >
              Have a general question? Contact us.
            </button>
            <a
              href={`mailto:${brand.emailPlaceholder}`}
              className="footer-link"
              id="footer-email-link"
            >
              {brand.emailPlaceholder}
            </a>
            <a
              href={brand.instagramPlaceholder}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              id="footer-instagram-link"
            >
              Instagram ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{brand.copyright}</p>
          <p>Photography & Filmmaking Studio</p>
        </div>
      </div>
    </footer>
  );
}
