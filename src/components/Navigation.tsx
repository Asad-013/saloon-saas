import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser || null);

      if (authUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error.message);
          setUserRole(null);
        } else {
          setUserRole(profile?.role || 'user');
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Re-fetch role on auth state change
        fetchUserAndRole();
      } else {
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]); // Added navigate to dependencies as it's used in handleLogout, though not directly in this useEffect

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-card/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-xl font-playfair font-bold text-primary">Luxe Hair & Spa</h1>
              <p className="text-xs text-muted-foreground">Luxury Beauty Studio</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userRole === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'}`}>Admin</Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className={`text-sm font-medium transition-colors duration-200 ${isActive('/profile') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'}`}>Profile</Link>
                <Button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout <LogOut className="ml-2 w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="btn-accent">Login</Button>
              </Link>
            )}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Phone size={16} />
                <span>+880 1XXXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <span>9AM - 8PM</span>
              </div>
            </div>
            {!user && (
              <Link to="/booking">
                <Button className="btn-accent">Book Now</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-primary border-l-4 border-primary pl-4'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {userRole === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className={`block text-sm font-medium py-2 transition-colors duration-200 ${isActive('/admin') ? 'text-primary border-l-4 border-primary pl-4' : 'text-foreground hover:text-primary'}`}>Admin</Link>
              )}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className={`block text-sm font-medium py-2 transition-colors duration-200 ${isActive('/profile') ? 'text-primary border-l-4 border-primary pl-4' : 'text-foreground hover:text-primary'}`}>Profile</Link>
                    <Button onClick={handleLogout} className="btn-secondary w-full mb-4">
                      Logout <LogOut className="ml-2 w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="btn-accent w-full mb-4">Login</Button>
                  </Link>
                )}
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>+880 1XXXXXXXXX</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Mon-Fri: 9AM-8PM, Sat: 10AM-6PM</span>
                  </div>
                </div>
                {!user && (
                  <Link to="/booking" onClick={() => setIsOpen(false)}>
                    <Button className="btn-accent w-full">Book Appointment</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;