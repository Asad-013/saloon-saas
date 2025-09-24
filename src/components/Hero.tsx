import { Link } from 'react-router-dom';
import { Calendar, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-salon.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary/10 to-accent/5">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxe Hair & Spa Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 fill-current" />
                <span>5-Star Rated Salon</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                Book Your Next
                <span className="block text-accent">Look in Seconds</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                Transform your style at Dhaka's premier luxury salon. Professional stylists, premium products, and an unforgettable experience.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/booking">
                <Button className="btn-accent text-lg px-8 py-4 w-full sm:w-auto">
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button className="btn-ghost text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-4 w-full sm:w-auto">
                  See Services
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">5 Years</div>
                <div className="text-sm text-white/80">Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">15+</div>
                <div className="text-sm text-white/80">Services</div>
              </div>
            </div>
          </div>

          {/* Right Content - Quick Booking Card */}
          <div className="lg:justify-self-end">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl luxury-shadow max-w-md">
              <h3 className="text-2xl font-playfair font-bold text-primary mb-6">Quick Booking</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border">
                  <span className="font-medium">Classic Haircut</span>
                  <span className="text-accent font-bold">৳40</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border">
                  <span className="font-medium">Signature Facial</span>
                  <span className="text-accent font-bold">৳60</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border">
                  <span className="font-medium">Bridal Makeup</span>
                  <span className="text-accent font-bold">৳150</span>
                </div>
              </div>

              <Link to="/booking">
                <Button className="btn-luxury w-full text-lg py-4">
                  Book Any Service
                </Button>
              </Link>

              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                120 Beauty Lane, Dhaka
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;