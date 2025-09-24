import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ServicesPreview from '@/components/ServicesPreview';
import Testimonials from '@/components/Testimonials';
import GalleryPreview from '@/components/GalleryPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ServicesPreview />
        <Testimonials />
        <GalleryPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
