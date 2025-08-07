-- First, create the mock user profile that the maid_contacts will reference
INSERT INTO public.profiles (
  id,
  username,
  role,
  phone_number,
  house_group_id
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Test User',
  'user',
  '+1234567890',
  '00000000-0000-4000-8000-000000000002'
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  role = EXCLUDED.role,
  phone_number = EXCLUDED.phone_number,
  house_group_id = EXCLUDED.house_group_id;

-- Now create the mock maid_contact record
INSERT INTO public.maid_contacts (
  id,
  user_id,
  name,
  phone,
  auto_send,
  send_time,
  frequency,
  days_of_week,
  last_sent_at
) VALUES (
  '48833854-5b07-4415-83fd-ab429efe1f17',
  '00000000-0000-4000-8000-000000000001',
  'Test Maid',
  '+1234567890',
  true,
  '08:00',
  'daily',
  ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  NULL
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  auto_send = EXCLUDED.auto_send,
  send_time = EXCLUDED.send_time,
  frequency = EXCLUDED.frequency,
  days_of_week = EXCLUDED.days_of_week,
  last_sent_at = NULL;

-- Add sample tasks for the mock user
INSERT INTO public.maid_tasks (
  user_id,
  title,
  selected,
  completed,
  favorite,
  task_category,
  remarks,
  priority
) VALUES 
  ('00000000-0000-4000-8000-000000000001', 'Clean kitchen', true, false, false, 'cleaning', 'Focus on countertops and sink', 'high'),
  ('00000000-0000-4000-8000-000000000001', 'Vacuum living room', true, false, false, 'cleaning', 'Move furniture if needed', 'medium'),
  ('00000000-0000-4000-8000-000000000001', 'Clean bathroom', true, false, false, 'cleaning', 'Include mirror and fixtures', 'high'),
  ('00000000-0000-4000-8000-000000000001', 'Dust furniture', false, false, false, 'cleaning', 'All surfaces', 'low'),
  ('00000000-0000-4000-8000-000000000001', 'Mop floors', true, false, true, 'cleaning', 'Kitchen and bathroom only', 'medium')
ON CONFLICT DO NOTHING;