import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GalleryPreview = () => {
  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop',
      alt: 'Hair styling transformation',
      category: 'Hair'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop',
      alt: 'Bridal makeup look',
      category: 'Makeup'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop',
      alt: 'Hair color transformation',
      category: 'Color'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      alt: 'Facial treatment result',
      category: 'Skincare'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop',
      alt: 'Wedding hair styling',
      category: 'Bridal'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=600&fit=crop',
      alt: 'Modern haircut style',
      category: 'Hair'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Work
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
            Beauty Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Witness the artistry and transformation. Each photo tells a story of confidence, beauty, and expert craftsmanship.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 || index === 3 ? 'md:row-span-2' : ''
              } ${index === 1 ? 'md:col-span-2' : ''}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium w-fit mb-2">
                    {image.category}
                  </div>
                  <p className="text-white text-sm">{image.alt}</p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/50 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/gallery">
              <Button className="btn-luxury text-lg px-8 py-4">
                View Full Gallery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-muted-foreground hover:text-accent transition-colors"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Follow us on Instagram
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-border text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">2000+</div>
            <div className="text-sm text-muted-foreground">Transformations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">15+</div>
            <div className="text-sm text-muted-foreground">Services</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">5+</div>
            <div className="text-sm text-muted-foreground">Expert Stylists</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;