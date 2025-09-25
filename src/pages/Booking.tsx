import { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import haircutImage from '@/assets/service-haircut.jpg';
import facialImage from '@/assets/service-facial.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null as any,
    staff: null as any,
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [allStaff, setAllStaff] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
      if (user) {
        setBookingData(prev => ({
          ...prev,
          customerEmail: user.email || '',
          customerName: user.user_metadata.full_name || '',
          customerPhone: user.user_metadata.phone_number || '',
        }));
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setBookingData(prev => ({
          ...prev,
          customerEmail: session.user.email || '',
          customerName: session.user.user_metadata.full_name || '',
          customerPhone: session.user.user_metadata.phone_number || '',
        }));
      } else {
        setBookingData(prev => ({
          ...prev,
          customerEmail: '',
          customerName: '',
          customerPhone: '',
        }));
      }
    });

    const fetchServicesAndStaff = async () => {
      // Fetch active services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, description, price, duration, image_url')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (servicesError) {
        toast({
          title: "Error fetching services",
          description: servicesError.message,
          variant: "destructive",
        });
        setServices([]);
      } else {
        setServices(servicesData || []);
      }

      // Fetch active staff with their assigned services
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role, image_url, staff_services(service_id)')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (staffError) {
        toast({
          title: "Error fetching staff",
          description: staffError.message,
          variant: "destructive",
        });
        setAllStaff([]);
      } else {
        setAllStaff(staffData || []);
      }
    };

    fetchServicesAndStaff();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const fetchAvailableTimeSlots = async (staffId: string, date: string) => {
    const { data, error } = await supabase
      .from('time_slots')
      .select('id, time')
      .eq('staff_id', staffId)
      .eq('date', date)
      .eq('is_available', true)
      .is('booking_id', null)
      .order('time', { ascending: true });

    if (error) {
      console.error("Error fetching available time slots:", error.message);
      setAvailableTimeSlots([]);
    } else {
      setAvailableTimeSlots(data || []);
    }
  };

  // Filter staff based on selected service
  const filteredStaff = bookingData.service
    ? allStaff.filter(staffMember =>
        staffMember.staff_services.some((ss: { service_id: string; }) => ss.service_id === bookingData.service?.id)
      )
    : allStaff;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleServiceSelect = (service: any) => {
    setBookingData(prev => ({ ...prev, service, staff: null, date: '', time: '' })); // Reset staff/date/time when service changes
    nextStep();
  };

  const handleStaffSelect = (selectedStaff: any) => {
    setBookingData(prev => ({ ...prev, staff: selectedStaff, date: '', time: '' })); // Reset date/time when staff changes
    nextStep();
  };

  const handleDateSelect = async (date: string) => {
    setBookingData(prev => ({ ...prev, date, time: '' })); // Reset time when date changes
    if (bookingData.staff?.id) {
      await fetchAvailableTimeSlots(bookingData.staff.id, date);
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
    nextStep();
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleBookingConfirm = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a service.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    const { service, staff, date, time, notes, customerName, customerEmail, customerPhone } = bookingData;

    if (!service || !staff || !date || !time) {
      toast({
        title: "Error",
        description: "Please select a service, staff, date, and time.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Find the specific time slot ID that the user selected
      const selectedTimeSlot = availableTimeSlots.find(slot => slot.time === time);
      if (!selectedTimeSlot) {
        throw new Error("Selected time slot is no longer available.");
      }

      // Insert the booking
      const { data: bookingInsertData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: service.id,
          staff_id: staff.id,
          booking_date: date,
          booking_time: time,
          notes: notes || null,
          status: 'pending',
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        })
        .select()
        .single();

      if (bookingError || !bookingInsertData) {
        throw bookingError || new Error("Failed to create booking.");
      }

      // Mark the time slot as booked
      const { error: timeSlotUpdateError } = await supabase
        .from('time_slots')
        .update({ is_available: false, booking_id: bookingInsertData.id })
        .eq('id', selectedTimeSlot.id);

      if (timeSlotUpdateError) {
        console.error("Error updating time slot status:", timeSlotUpdateError.message);
        // Optionally, you might want to revert the booking if time slot update fails
      }

      toast({
        title: "Booking Confirmed!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate('/profile'); // Redirect to profile to see bookings
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Next 30 days for booking
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: format(date, 'PPP')
      });
    }
    return dates;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-12 bg-gradient-subtle min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-playfair font-bold text-primary">Book Your Appointment</h1>
              <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 w-5 h-5 text-accent" />
                  Choose Your Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {services.length === 0 ? (
                    <p className="text-muted-foreground col-span-3">No active services available. Please check back later.</p>
                  ) : (
                    services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:luxury-shadow transition-all duration-300"
                      >
                        <img src={service.image_url || haircutImage} alt={service.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                        <h3 className="font-playfair font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                          {service.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-accent">৳{service.price}</span>
                          <span className="text-sm text-muted-foreground">{service.duration} mins</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Staff */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 w-5 h-5 text-accent" />
                  Choose Your Stylist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {filteredStaff.length === 0 ? (
                    <p className="text-muted-foreground col-span-3">No staff available for the selected service.</p>
                  ) : (
                    filteredStaff.map((staffMember) => (
                      <div
                        key={staffMember.id}
                        onClick={() => handleStaffSelect(staffMember)}
                        className={`cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:luxury-shadow transition-all duration-300 text-center ${
                          bookingData.staff?.id === staffMember.id ? 'border-accent shadow-md' : ''
                        }`}
                      >
                        {staffMember.image_url ? (
                          <img 
                            src={staffMember.image_url} 
                            alt={staffMember.name} 
                            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center">
                            <User className="w-8 h-8 text-accent" />
                          </div>
                        )}
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                          {staffMember.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{staffMember.role}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <Button onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Date & Time */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 w-5 h-5 text-accent" />
                  Choose Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Available Dates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    {getNextWeekDates().map((dateObj) => (
                      <button
                        key={dateObj.date}
                        onClick={() => handleDateSelect(dateObj.date)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          bookingData.date === dateObj.date
                            ? 'bg-accent text-white border-accent'
                            : 'bg-background hover:border-accent hover:text-accent'
                        }`}
                      >
                        {dateObj.display}
                      </button>
                    ))}
                  </div>
                </div>

                {bookingData.date && bookingData.staff && ( // Only show times if date and staff are selected
                  <div>
                    <h3 className="font-semibold mb-4">Available Times for {bookingData.staff.name} on {format(parseISO(bookingData.date), 'PPP')}</h3>
                    {availableTimeSlots.length === 0 ? (
                      <p className="text-muted-foreground">No available time slots for this date and staff member.</p>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleTimeSelect(slot.time)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              bookingData.time === slot.time
                                ? 'bg-accent text-white border-accent'
                                : 'bg-background hover:border-accent hover:text-accent'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Customer Details */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        required
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder="+880 1XXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      required
                      type="email"
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                      disabled={!!user} // Disable email input if user is logged in
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Special Notes (Optional)</label>
                    <Textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button type="submit" className="btn-accent">
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background p-6 rounded-xl mb-6">
                  <h3 className="font-playfair font-bold text-xl mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{bookingData.service?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stylist:</span>
                      <span className="font-medium">{bookingData.staff?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{format(parseISO(bookingData.date), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{bookingData.service?.duration} minutes</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-accent">৳{bookingData.service?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 p-4 rounded-xl mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Please note:</strong> Your appointment is subject to confirmation. You will receive a confirmation email shortly. 
                    For any changes or cancellations, please call us at +880 1XXXXXXXXX at least 24 hours in advance.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline" disabled={loading}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleBookingConfirm} className="btn-accent" disabled={loading}>
                    {loading ? 'Confirming...' : <><Check className="mr-2 w-4 h-4" /> Confirm Booking</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;