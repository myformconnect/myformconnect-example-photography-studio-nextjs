import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

export default function StoriesBehindTheFrame() {
  const { stories } = siteConfig;

  return (
    <section id="stories" className="stories-section" aria-labelledby="stories-heading">
      <div className="container">
        <div className="stories-header">
          <span className="stories-eyebrow">EDITORIAL PERSPECTIVES</span>
          <h2 id="stories-heading" className="stories-heading">
            {stories.heading}
          </h2>
          <p className="stories-subheading">{stories.copy}</p>
        </div>

        <div className="stories-grid">
          {stories.items.map((story) => (
            <article key={story.id} className="story-card" id={story.id}>
              <div className="story-image-wrap">
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="story-image"
                  loading="lazy"
                />
              </div>

              <div className="story-content">
                <span className="story-category">{story.category}</span>
                <h3 className="story-title">{story.title}</h3>
                <p className="story-desc">{story.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
