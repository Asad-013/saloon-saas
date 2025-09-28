import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Clock } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      fetchBookings(user.id);
    };

    const fetchBookings = async (userId: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name)') // Fetch service name
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching bookings',
          description: error.message,
          variant: 'destructive',
        });
        setBookings([]);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    getProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Should redirect to login via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-playfair font-bold text-primary">My Profile</CardTitle>
              <CardDescription>View and manage your account information and bookings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2">User Information</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account created:</strong> {format(new Date(user.created_at), "PPP")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair font-bold text-primary">My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-muted-foreground">You have no upcoming bookings.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border p-4 rounded-lg bg-card">
                      <h4 className="font-semibold text-lg text-primary">Service: {booking.services?.name || 'N/A'}</h4>
                      <p className="text-muted-foreground flex items-center"><CalendarIcon className="w-4 h-4 mr-2" />Date: {format(new Date(booking.booking_date), "PPP")}</p>
                      <p className="text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2" />Time: {booking.booking_time}</p>
                      <p className="text-muted-foreground">Status: {booking.status}</p>
                      {booking.notes && <p className="text-muted-foreground">Notes: {booking.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
