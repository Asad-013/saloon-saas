import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We'd love to hear from you! Reach out to us for appointments, inquiries, or any beauty-related questions.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Contact Details */}
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
                  Reach Out to Radiant Apprentice
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Have questions or ready to book your next beauty experience? Our team is here to assist you.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center text-primary text-lg">
                    <Phone className="w-6 h-6 mr-4 text-accent" />
                    <span>+880 123 456789</span>
                  </div>
                  <div className="flex items-center text-primary text-lg">
                    <Mail className="w-6 h-6 mr-4 text-accent" />
                    <span>info@radiantapprentice.com</span>
                  </div>
                  <div className="flex items-start text-primary text-lg">
                    <MapPin className="w-6 h-6 mr-4 text-accent flex-shrink-0 mt-1" />
                    <span>123 Beauty Lane, Glamour City, GA 30303</span>
                  </div>
                </div>
                <div className="mt-10">
                  <Link to="/booking">
                    <Button className="btn-luxury text-lg px-8 py-4">
                      Book an Appointment
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden soft-shadow flex items-center justify-center text-muted-foreground">
                  <p>Map Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
