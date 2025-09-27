-- Generate time slots for next 30 days using a simple approach
WITH staff_list AS (
  SELECT id FROM public.staff
),
date_series AS (
  SELECT CURRENT_DATE + i AS slot_date
  FROM generate_series(0, 29) AS i
),
time_series AS (
  SELECT '09:00:00'::time + (i * interval '30 minutes') AS slot_time
  FROM generate_series(0, 18) AS i  -- 9:00 AM to 6:00 PM in 30-minute intervals
)
INSERT INTO public.time_slots (staff_id, date, time, is_available)
SELECT s.id, d.slot_date, t.slot_time, true
FROM staff_list s
CROSS JOIN date_series d
CROSS JOIN time_series t;