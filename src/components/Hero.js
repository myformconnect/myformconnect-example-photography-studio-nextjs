import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

export default function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-eyebrow">{siteConfig.brand.eyebrow}</span>
            <h1 id="hero-heading" className="hero-headline">
              {hero.headline}
            </h1>
            <p className="hero-copy">{hero.copy}</p>

            <div className="hero-actions">
              <a href="#enquiry" className="btn-primary" id="hero-primary-cta">
                {hero.primaryCta}
              </a>
              <a href="#selected-work" className="btn-secondary" id="hero-secondary-cta">
                {hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-image-wrap">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 50vw"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
