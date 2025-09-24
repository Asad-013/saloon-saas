import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import haircutImage from '@/assets/service-haircut.jpg';
import facialImage from '@/assets/service-facial.jpg';
import bridalImage from '@/assets/service-bridal.jpg';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Classic Haircut',
      slug: 'classic-haircut',
      price: 40,
      duration: 45,
      description: 'A precise haircut tailored to your style and face shape. Our expert stylists will work with you to create a look that complements your features and lifestyle.',
      image: haircutImage,
      popular: true,
      features: ['Consultation', 'Hair Wash', 'Precision Cut', 'Styling']
    },
    {
      id: 2,
      title: 'Signature Facial',
      slug: 'signature-facial',
      price: 60,
      duration: 60,
      description: 'Deep cleanse and glow facial for all skin types using premium organic products. Includes extraction, massage, and hydrating mask.',
      image: facialImage,
      popular: false,
      features: ['Skin Analysis', 'Deep Cleansing', 'Extractions', 'Hydrating Mask']
    },
    {
      id: 3,
      title: 'Bridal Makeup',
      slug: 'bridal-makeup',
      price: 150,
      duration: 180,
      description: 'Full bridal makeup package with trials included. Perfect for your special day with long-lasting, photography-ready results.',
      image: bridalImage,
      popular: true,
      features: ['Trial Session', 'Full Makeup', 'Touch-up Kit', 'Hair Styling']
    },
    {
      id: 4,
      title: 'Hair Coloring',
      slug: 'hair-coloring',
      price: 80,
      duration: 120,
      description: 'Professional hair coloring service using premium color products. From subtle highlights to bold transformations.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
      popular: false,
      features: ['Color Consultation', 'Premium Products', 'Color Protection', 'Styling']
    },
    {
      id: 5,
      title: 'Deep Conditioning Treatment',
      slug: 'hair-treatment',
      price: 50,
      duration: 60,
      description: 'Intensive hair treatment to restore moisture, strength, and shine. Perfect for damaged or chemically treated hair.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
      popular: false,
      features: ['Hair Analysis', 'Deep Treatment', 'Scalp Massage', 'Protective Serum']
    },
    {
      id: 6,
      title: 'Eyebrow Shaping',
      slug: 'eyebrow-shaping',
      price: 25,
      duration: 30,
      description: 'Professional eyebrow shaping and tinting to frame your face perfectly. Includes consultation and aftercare advice.',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
      popular: true,
      features: ['Brow Mapping', 'Precision Shaping', 'Optional Tinting', 'Aftercare Kit']
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Services
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
            Professional Beauty Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover our comprehensive range of beauty and wellness services, crafted by expert stylists using premium products.
          </p>
          <Link to="/booking">
            <Button className="btn-accent text-lg px-8 py-4">
              Book Any Service
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-card rounded-2xl overflow-hidden soft-shadow hover:luxury-shadow transition-all duration-300 hover:-translate-y-2"
              >
                {/* Service Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {service.popular && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-playfair font-bold text-primary group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-2xl font-bold text-accent">৳{service.price}</span>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-primary mb-2">Includes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} mins
                    </div>

                    <div className="flex space-x-2">
                      <Link to={`/services/${service.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-accent">
                          Details
                        </Button>
                      </Link>
                      <Link to="/booking">
                        <Button className="btn-accent text-sm px-4 py-2">
                          Book Now
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;