-- Create Enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table to store additional user information and roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy for admins to manage all profiles (assuming admin role can manage users)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- Function to create a public.profiles entry on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.phone, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Create staff_services join table
CREATE TABLE public.staff_services (
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (staff_id, service_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for staff_services
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to read staff_services
CREATE POLICY "Users can read staff_services" ON public.staff_services
  FOR SELECT USING (true);

-- Policy for admins to manage staff_services
CREATE POLICY "Admins can manage staff_services" ON public.staff_services
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- Refine RLS for existing tables

-- Services Table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
CREATE POLICY "All users can view services" ON public.services
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Staff Table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.staff;
CREATE POLICY "All users can view staff" ON public.staff
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage staff" ON public.staff
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Time Slots Table
CREATE POLICY "All users can view time_slots" ON public.time_slots
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage time_slots" ON public.time_slots
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bookings Table (Policies were already updated to use user_id, ensure admin can manage all)
-- Ensure the existing policies are sufficient or update if necessary.
-- For admin to manage all bookings:
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications Table (Policies were already created, ensure admin can manage all)
-- For admin to manage all notifications:
CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
