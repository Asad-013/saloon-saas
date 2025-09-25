-- Create Enum for notification type
CREATE TYPE public.notification_type AS ENUM ('email', 'sms', 'in_app');

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'sent', 'failed', 'queued'
  external_id TEXT, -- ID from external service like Twilio or SendGrid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow authenticated users to create notifications (internal only, for functions/triggers)
-- This policy might need to be more restrictive, allowing only service role or specific functions
CREATE POLICY "Service can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Function to send booking confirmation (placeholder for now)
CREATE OR REPLACE FUNCTION public.send_booking_confirmation_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- For now, we will simply insert a record into the notifications table.
  -- The actual sending logic will be handled by an Edge Function that polls this table or is invoked directly.
  INSERT INTO public.notifications(user_id, booking_id, type, subject, body, status)
  VALUES (
    NEW.user_id,
    NEW.id,
    'email', -- Assuming email for confirmation
    'Booking Confirmation for Service: ' || NEW.service_id,
    'Your booking for ' || NEW.service_id || ' on ' || NEW.booking_date || ' at ' || NEW.booking_time || ' has been received.',
    'queued'
  );

  -- You can add more logic here for SMS or in-app notifications if needed
  -- For SMS:
  -- INSERT INTO public.notifications(user_id, booking_id, type, subject, body, status)
  -- VALUES (
  --   NEW.user_id,
  --   NEW.id,
  --   'sms',
  --   NULL, -- SMS usually don't have a subject
  --   'Your booking for ' || NEW.service_id || ' on ' || NEW.booking_date || ' at ' || NEW.booking_time || ' has been confirmed.',
  --   'queued'
  -- );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires after a new booking is inserted
CREATE TRIGGER on_new_booking_send_notification
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.send_booking_confirmation_notification();
