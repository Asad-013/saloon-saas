import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Users } from 'lucide-react';
import heroSalon from '@/assets/hero-salon.jpg';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-subtle py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
              About Radiant Apprentice
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Crafting beauty, building confidence, one client at a time.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src={heroSalon}
                  alt="Salon Interior"
                  className="w-full h-auto object-cover rounded-2xl soft-shadow"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
                  Where Beauty Meets Expertise
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Radiant Apprentice was founded on the belief that beauty is more than skin deep. It's about empowering individuals to look and feel their absolute best. With a passion for artistry and a commitment to personalized service, we've created a sanctuary where every client's unique beauty is celebrated.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our journey began with a vision to blend traditional techniques with modern innovations, offering a comprehensive range of services that cater to diverse needs. From rejuvenating facials to transformative hair designs, our expert team is dedicated to delivering unparalleled quality and a luxurious experience.
                </p>
                <Link to="/services">
                  <Button className="btn-accent text-lg px-8 py-4">
                    Explore Our Services
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Philosophy
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl soft-shadow">
                <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-playfair font-bold text-primary mb-3">Excellence</h3>
                <p className="text-muted-foreground">We commit to delivering exceptional results and a luxurious experience with every service.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl soft-shadow">
                <Heart className="w-12 h-12 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-playfair font-bold text-primary mb-3">Passion</h3>
                <p className="text-muted-foreground">Our team is driven by a genuine love for beauty and a desire to make every client feel special.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl soft-shadow">
                <Users className="w-12 h-12 text-accent mx-auto mb-6" />
                <h3 className="text-xl font-playfair font-bold text-primary mb-3">Client-Centric</h3>
                <p className="text-muted-foreground">Your satisfaction is our priority. We listen, understand, and tailor our services to your needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-background text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the Radiant Apprentice family and let us bring your beauty vision to life.
            </p>
            <Link to="/booking">
              <Button className="btn-luxury text-lg px-8 py-4">
                Book Your Transformation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
