import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand & Contact */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-bold">Luxe Hair & Spa</h3>
                  <p className="text-sm text-primary-foreground/80">Luxury Beauty Studio</p>
                </div>
              </div>
              
              <p className="text-primary-foreground/90 mb-6 max-w-md">
                Transform your style at Dhaka's premier luxury salon. Professional stylists, premium products, and an unforgettable experience await you.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>120 Beauty Lane, Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <span>+880 1XXXXXXXXX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>hello@luxehairspa.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-accent hover:text-accent/80 transition-colors font-medium">
                    Book Now
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services & Hours */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Popular Services</h4>
              <ul className="space-y-3 mb-8">
                <li className="text-primary-foreground/80">Classic Haircut</li>
                <li className="text-primary-foreground/80">Signature Facial</li>
                <li className="text-primary-foreground/80">Bridal Makeup</li>
                <li className="text-primary-foreground/80">Hair Coloring</li>
              </ul>

              <h5 className="font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 text-accent mr-2" />
                Opening Hours
              </h5>
              <div className="space-y-2 text-sm text-primary-foreground/80">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-accent">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/70 text-sm mb-4 md:mb-0">
              © {currentYear} Luxe Hair & Spa. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;