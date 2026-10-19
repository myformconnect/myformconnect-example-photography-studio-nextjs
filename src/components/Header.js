import { siteConfig } from '@/lib/siteConfig';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <div className="header-brand">
            <a href="#" className="brand-title">
              {siteConfig.brand.name}
            </a>
            <span className="brand-subtitle">Photography & Film</span>
          </div>

          <nav aria-label="Main action">
            <a href="#enquiry" className="header-cta" id="header-cta-btn">
              Start a Project ↗
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
