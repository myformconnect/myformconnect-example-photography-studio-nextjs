import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SelectedWork from '@/components/SelectedWork';
import StoriesBehindTheFrame from '@/components/StoriesBehindTheFrame';
import StudioIntro from '@/components/StudioIntro';
import EnquirySection from '@/components/EnquirySection';
import Footer from '@/components/Footer';
import GlobalModals from '@/components/GlobalModals';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <SelectedWork />
        <StoriesBehindTheFrame />
        <StudioIntro />
        <EnquirySection />
      </main>
      <Footer />
      <GlobalModals />
    </>
  );
}
