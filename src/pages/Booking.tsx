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

  const services = [
    {
      id: 1,
      title: 'Classic Haircut',
      price: 40,
      duration: 45,
      image: haircutImage
    },
    {
      id: 2,
      title: 'Signature Facial',
      price: 60,
      duration: 60,
      image: facialImage
    },
    {
      id: 3,
      title: 'Bridal Makeup',
      price: 150,
      duration: 180,
      image: bridalImage
    }
  ];

  const staff = [
    { id: 1, name: 'Asha Rahman', role: 'Senior Stylist', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face' },
    { id: 2, name: 'Milan Chowdhury', role: 'Makeup Artist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
    { id: 'any', name: 'Any Available', role: 'First Available Stylist', image: null }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleServiceSelect = (service: any) => {
    setBookingData(prev => ({ ...prev, service }));
    nextStep();
  };

  const handleStaffSelect = (selectedStaff: any) => {
    setBookingData(prev => ({ ...prev, staff: selectedStaff }));
    nextStep();
  };

  const handleDateSelect = (date: string) => {
    setBookingData(prev => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
    nextStep();
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleBookingConfirm = () => {
    // In a real app, this would send the booking to the API
    console.log('Booking confirmed:', bookingData);
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
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
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:luxury-shadow transition-all duration-300"
                    >
                      <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                      <h3 className="font-playfair font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-accent">৳{service.price}</span>
                        <span className="text-sm text-muted-foreground">{service.duration} mins</span>
                      </div>
                    </div>
                  ))}
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
                  {staff.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleStaffSelect(member)}
                      className="cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:luxury-shadow transition-all duration-300 text-center"
                    >
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-accent" />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  ))}
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

                {bookingData.date && (
                  <div>
                    <h3 className="font-semibold mb-4">Available Times</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className="p-3 rounded-lg border text-sm font-medium bg-background hover:border-accent hover:text-accent transition-all"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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
                      <span className="font-medium">{bookingData.service?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stylist:</span>
                      <span className="font-medium">{bookingData.staff?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(bookingData.date).toLocaleDateString()}</span>
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
                    <strong>Please note:</strong> Your appointment is subject to confirmation. You will receive a confirmation email within 2 hours. 
                    For any changes or cancellations, please call us at +880 1XXXXXXXXX at least 24 hours in advance.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleBookingConfirm} className="btn-accent">
                    <Check className="mr-2 w-4 h-4" />
                    Confirm Booking
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