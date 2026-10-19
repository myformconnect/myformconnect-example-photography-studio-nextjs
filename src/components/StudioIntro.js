import { siteConfig } from '@/lib/siteConfig';

export default function StudioIntro() {
  const { intro } = siteConfig;

  return (
    <section className="intro-section" aria-labelledby="intro-heading">
      <div className="container">
        <div className="intro-content">
          <h2 id="intro-heading" className="intro-heading">
            {intro.heading}
          </h2>
          <p className="intro-copy">{intro.copy}</p>
          <div className="intro-disciplines">{intro.disciplines}</div>
        </div>
      </div>
    </section>
  );
}
