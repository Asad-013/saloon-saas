import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, ArrowRight, ArrowLeft, Check, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingStepsProps {
  currentStep: number;
  bookingData: any;
  services: any[];
  filteredStaff: any[];
  availableTimeSlots: any[];
  loading: boolean;
  onServiceSelect: (service: any) => void;
  onStaffSelect: (staff: any) => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onCustomerInfoSubmit: (e: React.FormEvent) => void;
  onBookingConfirm: () => void;
  onPrevStep: () => void;
  onDataChange: (key: string, value: string) => void;
  getNextWeekDates: () => { date: string; display: string }[];
}

const BookingSteps = ({
  currentStep,
  bookingData,
  services,
  filteredStaff,
  availableTimeSlots,
  loading,
  onServiceSelect,
  onStaffSelect,
  onDateSelect,
  onTimeSelect,
  onCustomerInfoSubmit,
  onBookingConfirm,
  onPrevStep,
  onDataChange,
  getNextWeekDates
}: BookingStepsProps) => {

  // Step 1: Select Service
  if (currentStep === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 w-5 h-5 text-accent" />
            Choose Your Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length === 0 ? (
              <p className="text-muted-foreground col-span-3">No active services available. Please check back later.</p>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onServiceSelect(service)}
                  className="cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:shadow-lg transition-all duration-300"
                >
                  <img 
                    src={service.image_url || '/placeholder.svg'} 
                    alt={service.name} 
                    className="w-full h-40 object-cover rounded-lg mb-4" 
                  />
                  <h3 className="font-playfair font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-accent">{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration} mins</span>
                  </div>
                  <div className="mt-3">
                    <Button className="w-full" variant="outline">
                      Select Service
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Select Staff
  if (currentStep === 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 w-5 h-5 text-accent" />
            Choose Your Expert
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Select from our qualified professionals specializing in {bookingData.service?.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length === 0 ? (
              <p className="text-muted-foreground col-span-3">No staff available for the selected service.</p>
            ) : (
              filteredStaff.map((staffMember) => (
                <div
                  key={staffMember.id}
                  onClick={() => onStaffSelect(staffMember)}
                  className={`cursor-pointer group bg-background p-6 rounded-xl border hover:border-accent hover:shadow-lg transition-all duration-300 ${
                    bookingData.staff?.id === staffMember.id ? 'border-accent shadow-md ring-2 ring-accent/20' : ''
                  }`}
                >
                  <div className="text-center">
                    {staffMember.image_url ? (
                      <img 
                        src={staffMember.image_url} 
                        alt={staffMember.name} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-accent/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center border-4 border-accent/20">
                        <User className="w-10 h-10 text-accent" />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                      {staffMember.name}
                    </h3>
                    <p className="text-sm text-accent font-medium mb-2">{staffMember.role}</p>
                    {staffMember.bio && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{staffMember.bio}</p>
                    )}
                    <div className="flex justify-center items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">5.0</span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={bookingData.staff?.id === staffMember.id ? "default" : "outline"}
                    >
                      {bookingData.staff?.id === staffMember.id ? "Selected" : "Choose Expert"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between mt-6">
            <Button onClick={onPrevStep} variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Select Date & Time
  if (currentStep === 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 w-5 h-5 text-accent" />
            Choose Date & Time
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Book your appointment with {bookingData.staff?.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Available Dates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {getNextWeekDates().map((dateObj) => (
                <button
                  key={dateObj.date}
                  onClick={() => onDateSelect(dateObj.date)}
                  className={`p-4 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                    bookingData.date === dateObj.date
                      ? 'bg-accent text-white border-accent shadow-lg'
                      : 'bg-background hover:border-accent hover:text-accent hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{format(parseISO(dateObj.date), 'dd')}</div>
                    <div className="text-xs opacity-75">{format(parseISO(dateObj.date), 'MMM')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {bookingData.date && bookingData.staff && (
            <div>
              <h3 className="font-semibold mb-4">
                Available Times for {format(parseISO(bookingData.date), 'PPPP')}
              </h3>
              {availableTimeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No available time slots for this date.</p>
                  <p className="text-sm text-muted-foreground mt-2">Please select a different date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onTimeSelect(slot.time)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                        bookingData.time === slot.time
                          ? 'bg-accent text-white border-accent shadow-lg'
                          : 'bg-background hover:border-accent hover:text-accent hover:shadow-md'
                      }`}
                    >
                      {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button onClick={onPrevStep} variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 4: Customer Details
  if (currentStep === 4) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <p className="text-sm text-muted-foreground">Please provide your contact information</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCustomerInfoSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  required
                  value={bookingData.customerName}
                  onChange={(e) => onDataChange('customerName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  required
                  type="tel"
                  value={bookingData.customerPhone}
                  onChange={(e) => onDataChange('customerPhone', e.target.value)}
                  placeholder="+880 1234 567890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                required
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => onDataChange('customerEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Special Notes (Optional)</label>
              <Textarea
                value={bookingData.notes}
                onChange={(e) => onDataChange('notes', e.target.value)}
                placeholder="Any special requests or notes for your appointment..."
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" onClick={onPrevStep} variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button type="submit">
                Review Booking
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Step 5: Confirmation
  if (currentStep === 5) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="mr-2 w-5 h-5 text-accent" />
            Confirm Your Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Booking Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{bookingData.service?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expert:</span>
                      <span className="font-medium">{bookingData.staff?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {bookingData.date && format(parseISO(bookingData.date), 'PPPP')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {bookingData.time && format(parseISO(`2000-01-01T${bookingData.time}`), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{bookingData.service?.duration} minutes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{bookingData.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{bookingData.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{bookingData.customerEmail}</span>
                    </div>
                    {bookingData.notes && (
                      <div>
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="text-sm mt-1">{bookingData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-accent">{bookingData.service?.price}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" onClick={onPrevStep} variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={onBookingConfirm} 
                disabled={loading}
                className="min-w-32"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
                <Check className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default BookingSteps;