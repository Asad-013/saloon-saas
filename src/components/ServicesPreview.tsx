import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import haircutImage from '@/assets/service-haircut.jpg';
import facialImage from '@/assets/service-facial.jpg';
import bridalImage from '@/assets/service-bridal.jpg';

interface Service {
  id: number;
  title: string;
  slug: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  popular: boolean;
}

const ServicesPreview = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services'); // Placeholder API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Service[] = await response.json();
        // For demonstration, using local images. In a real app, data.image would be a URL.
        const servicesWithLocalImages = data.map(service => {
          let image;
          if (service.slug === 'classic-haircut') image = haircutImage;
          else if (service.slug === 'signature-facial') image = facialImage;
          else if (service.slug === 'bridal-makeup') image = bridalImage;
          else image = haircutImage; // Default or placeholder image
          return { ...service, image };
        });
        setServices(servicesWithLocalImages);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to hardcoded services if API call fails
        setServices([
          {
            id: 1,
            title: 'Classic Haircut',
            slug: 'classic-haircut',
            price: 40,
            duration: 45,
            description: 'A precise haircut tailored to your style and face shape.',
            image: haircutImage,
            popular: true
          },
          {
            id: 2,
            title: 'Signature Facial',
            slug: 'signature-facial',
            price: 60,
            duration: 60,
            description: 'Deep cleanse and glow facial for all skin types.',
            image: facialImage,
            popular: false
          },
          {
            id: 3,
            title: 'Bridal Makeup',
            slug: 'bridal-makeup',
            price: 150,
            duration: 180,
            description: 'Full bridal makeup package with trials included.',
            image: bridalImage,
            popular: true
          }
        ]);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (serviceId: number) => {
    setSelectedServiceIds(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(serviceId)) {
        newSelection.delete(serviceId);
      } else {
        newSelection.add(serviceId);
      }
      return newSelection;
    });
  };

  const handleQuickBook = () => {
    const bookableServices = services.filter(service => selectedServiceIds.has(service.id));
    console.log("Booking these services:", bookableServices);
    // TODO: Integrate with actual booking flow
    alert(`Quick booking for ${bookableServices.length} service(s)! Check console for details.`);
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
            Transform Your Look
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From classic cuts to luxury treatments, our expert stylists deliver exceptional results using premium products and techniques.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const isSelected = selectedServiceIds.has(service.id);
            return (
              <div
                key={service.id}
                className={`group bg-card rounded-2xl overflow-hidden soft-shadow hover:luxury-shadow transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
                onClick={() => handleServiceSelect(service.id)}
              >
                {/* Service Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {service.popular && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-playfair font-bold text-primary group-hover:text-muted-foreground transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-2xl font-bold text-primary">৳{service.price}</span>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} mins
                    </div>

                    <Link to={`/services/${service.slug}`} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="text-primary hover:text-white hover:bg-primary p-2">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedServiceIds.size > 0 && (
          <div className="text-center mt-8">
            <Button className="btn-luxury text-lg px-8 py-4" onClick={handleQuickBook}>
              Book Selected Services ({selectedServiceIds.size})
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* View All Services CTA */}
        <div className="text-center mt-8">
          <Link to="/services">
            <Button className="btn-luxury text-lg px-8 py-4">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;