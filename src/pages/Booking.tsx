import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BookingSteps from '@/components/BookingSteps';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
        .select('id, name, role, bio, image_url, staff_services(service_id)')
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
    setBookingData(prev => ({ ...prev, service, staff: null, date: '', time: '' }));
    nextStep();
  };

  const handleStaffSelect = (selectedStaff: any) => {
    setBookingData(prev => ({ ...prev, staff: selectedStaff, date: '', time: '' }));
    nextStep();
  };

  const handleDateSelect = async (date: string) => {
    setBookingData(prev => ({ ...prev, date, time: '' }));
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
      const selectedTimeSlot = availableTimeSlots.find(slot => slot.time === time);
      if (!selectedTimeSlot) {
        throw new Error("Selected time slot is no longer available.");
      }

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

      const { error: timeSlotUpdateError } = await supabase
        .from('time_slots')
        .update({ is_available: false, booking_id: bookingInsertData.id })
        .eq('id', selectedTimeSlot.id);

      if (timeSlotUpdateError) {
        console.error("Error updating time slot status:", timeSlotUpdateError.message);
      }

      toast({
        title: "Booking Confirmed!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate('/profile');
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

  const handleDataChange = (key: string, value: string) => {
    setBookingData(prev => ({ ...prev, [key]: value }));
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-12 bg-gradient-subtle min-h-[80vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-playfair font-bold text-primary">Book Your Appointment</h1>
              <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? 'text-accent font-medium' : ''}>Service</span>
              <span className={currentStep >= 2 ? 'text-accent font-medium' : ''}>Expert</span>
              <span className={currentStep >= 3 ? 'text-accent font-medium' : ''}>DateTime</span>
              <span className={currentStep >= 4 ? 'text-accent font-medium' : ''}>Details</span>
              <span className={currentStep >= 5 ? 'text-accent font-medium' : ''}>Confirm</span>
            </div>
          </div>

          <BookingSteps
            currentStep={currentStep}
            bookingData={bookingData}
            services={services}
            filteredStaff={filteredStaff}
            availableTimeSlots={availableTimeSlots}
            loading={loading}
            onServiceSelect={handleServiceSelect}
            onStaffSelect={handleStaffSelect}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onCustomerInfoSubmit={handleCustomerInfoSubmit}
            onBookingConfirm={handleBookingConfirm}
            onPrevStep={prevStep}
            onDataChange={handleDataChange}
            getNextWeekDates={getNextWeekDates}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;