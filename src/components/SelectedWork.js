import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

export default function SelectedWork() {
  const { selectedWork } = siteConfig;

  return (
    <section id="selected-work" className="work-section" aria-labelledby="work-heading">
      <div className="container">
        <div className="work-header">
          <div>
            <h2 id="work-heading" className="work-heading">
              {selectedWork.heading}
            </h2>
            <p className="work-subheading">{selectedWork.copy}</p>
          </div>
        </div>

        <div className="work-grid">
          {selectedWork.categories.map((category, index) => {
            // Layout ratios
            const ratioClass =
              category.aspectRatio === 'portrait'
                ? 'ratio-portrait'
                : category.aspectRatio === 'landscape'
                ? 'ratio-landscape'
                : 'ratio-square';

            return (
              <article
                key={category.id}
                className={`work-item ${index === 0 ? 'item-tall' : ''}`}
                id={`work-${category.id}`}
              >
                <div className={`work-image-frame ${ratioClass}`}>
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(max-width: 840px) 100vw, 50vw"
                    className="work-image"
                    loading="lazy"
                  />
                </div>

                <div className="work-meta">
                  <span className="work-number">Category {category.number}</span>
                  <h3 className="work-title">{category.title}</h3>
                </div>

                <p className="work-desc">{category.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
