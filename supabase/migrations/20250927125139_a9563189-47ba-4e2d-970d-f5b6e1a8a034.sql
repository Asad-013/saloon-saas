-- Insert staff-service relationships
INSERT INTO public.staff_services (staff_id, service_id) 
SELECT s.id, srv.id 
FROM public.staff s, public.services srv 
WHERE 
  (s.name = 'Sarah Johnson' AND srv.name IN ('Hair Cut & Styling', 'Eyebrow Threading')) OR
  (s.name = 'Maya Patel' AND srv.name IN ('Deep Cleansing Facial', 'Eyebrow Threading', 'Manicure & Pedicure')) OR
  (s.name = 'Priya Sharma' AND srv.name IN ('Bridal Makeup', 'Deep Cleansing Facial')) OR
  (s.name = 'Ravi Kumar' AND srv.name IN ('Hair Color & Highlights', 'Hair Cut & Styling'));