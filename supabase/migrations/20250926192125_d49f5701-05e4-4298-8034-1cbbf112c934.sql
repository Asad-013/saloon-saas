-- Fix database schema issues and RLS recursion
-- First, fix the price column type in services table
ALTER TABLE public.services ALTER COLUMN price TYPE text;

-- Create security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Drop existing recursive policies and create new ones using the function
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage staff" ON public.staff;
DROP POLICY IF EXISTS "Admins can manage staff_services" ON public.staff_services;
DROP POLICY IF EXISTS "Admins can manage time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- Create new non-recursive policies
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all bookings" ON public.bookings
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage services" ON public.services
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage staff" ON public.staff
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage staff_services" ON public.staff_services
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage time_slots" ON public.time_slots
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all notifications" ON public.notifications
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Insert admin user profile (will be created after auth signup)
INSERT INTO public.profiles (id, full_name, role) 
SELECT id, 'Admin User', 'admin'::user_role 
FROM auth.users 
WHERE email = 'badhona931@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;