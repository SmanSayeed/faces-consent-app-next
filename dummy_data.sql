-- DUMMY DATA INSERTION SCRIPT
-- Run this in Supabase SQL Editor

-- 1. CLEAR EXISTING DATA (Optional - Be careful in production)
TRUNCATE TABLE public.items RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.marketing_items RESTART IDENTITY CASCADE;

-- 2. CATEGORIES
-- Images used are from Icons8 (Free tier, link required in real app but fine for dummy/dev)

INSERT INTO public.categories (title, type, image_url) VALUES 
-- TREATMENT CATEGORIES (User)
('Injectables', 'treatment', 'https://img.icons8.com/color/96/syringe.png'),
('Cosmetics', 'treatment', 'https://img.icons8.com/color/96/makeup.png'),
('Beauty', 'treatment', 'https://img.icons8.com/color/96/lipstick.png'),
('Dentist', 'treatment', 'https://img.icons8.com/color/96/dental-braces.png'),
('Hair', 'treatment', 'https://img.icons8.com/color/96/hair-dryer.png'),
('Face', 'treatment', 'https://img.icons8.com/color/96/face.png'),
('Body', 'treatment', 'https://img.icons8.com/color/96/torso.png'),
('Laser', 'treatment', 'https://img.icons8.com/color/96/laser-beam.png'),
('Skin', 'treatment', 'https://img.icons8.com/color/96/skin.png'),
('Spas', 'treatment', 'https://img.icons8.com/color/96/spa-flower.png'),
('Tattoos', 'treatment', 'https://img.icons8.com/color/96/tattoo-machine.png'),
('SMP', 'treatment', 'https://img.icons8.com/color/96/hair-transplantation.png'), -- Scalp Micro
('Nails', 'treatment', 'https://img.icons8.com/color/96/nail-polish.png'),
('Massage', 'treatment', 'https://img.icons8.com/color/96/massage.png'),
('Podiatrist', 'treatment', 'https://img.icons8.com/color/96/foot.png'),
('Opticians', 'treatment', 'https://img.icons8.com/color/96/glasses.png'),
('Audiologist', 'treatment', 'https://img.icons8.com/color/96/hearing-aid.png'),

-- TRAINING CATEGORIES (User seeking courses)
('Aesthetic Training', 'training', 'https://img.icons8.com/color/96/student-male.png'),
('Beauty Courses', 'training', 'https://img.icons8.com/color/96/diploma.png'),
('Hair Styling', 'training', 'https://img.icons8.com/color/96/hair-clip.png'),
('Nail Art', 'training', 'https://img.icons8.com/color/96/manicure.png'),
('Laser Cert', 'training', 'https://img.icons8.com/color/96/certificate.png'),
('Massage Therapy', 'training', 'https://img.icons8.com/color/96/massage-table.png'),

-- CLINIC SERVICES (B2B for Clinics)
('Insurance', 'clinic_service', 'https://img.icons8.com/color/96/security-shield-green.png'),
('Marketing', 'clinic_service', 'https://img.icons8.com/color/96/commercial.png'),
('Finance', 'clinic_service', 'https://img.icons8.com/color/96/money-bag.png'),
('Supplies', 'clinic_service', 'https://img.icons8.com/color/96/box.png'),
('Prescriptions', 'clinic_service', 'https://img.icons8.com/color/96/rx.png');


-- 3. ITEMS (Specific Services/Courses)
-- We map these roughly to the IDs created above. 
-- Assuming IDs start at 1 because of TRUNCATE ... RESTART IDENTITY.

INSERT INTO public.items (category_id, title, description, price, image_url) VALUES
-- Under Injectables (ID 1)
(1, 'Anti-Wrinkle Consultation', 'Comprehensive consultation for wrinkle reduction.', 50.00, 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=300&auto=format&fit=crop'),
(1, '3 Areas Botox', 'Standard 3 area treatment for forehead and crows feet.', 250.00, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop'),
(1, 'Lip Fillers (1ml)', 'Premium dermal filler for lip enhancement.', 200.00, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300&auto=format&fit=crop'),

-- Under Skin (ID 9)
(9, 'HydraFacial', 'Deep cleansing and hydrating facial.', 120.00, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=300&auto=format&fit=crop'),
(9, 'Chemical Peel', 'Skin resurfacing treatment.', 90.00, 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=300&auto=format&fit=crop'),

-- Under Aesthetic Training (ID 18)
(18, 'Foundation Botox Course', 'One day course for beginners.', 995.00, 'https://images.unsplash.com/photo-1576091160550-2187d80aeff2?q=80&w=300&auto=format&fit=crop'),
(18, 'Advanced Filler Masterclass', 'Techniques for jawline and cheeks.', 1500.00, 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=300&auto=format&fit=crop');


-- 4. MARKETING ITEMS (Featured / Explore)
-- High quality card images

INSERT INTO public.marketing_items (title, image_url, type, is_featured, target_audience, description) VALUES
-- FEATURED (B2C & B2B)
('Summer Glow Package', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop', 'treatment', true, 'user', 'Get 20% off all skin treatments this summer.'),
('Master the Art of Lips', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800&auto=format&fit=crop', 'course', true, 'user', 'New advanced training modules available now.'),
('Clinic Insurance Deal', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop', 'insurance', true, 'clinic', 'Comprehensive indemnity cover for aesthetics practitioners.'),

-- EXPLORE MORE (B2C)
('Skin Products', 'https://images.unsplash.com/photo-1556228578-8c89e6fb31c7?q=80&w=800&auto=format&fit=crop', 'product', false, 'user', 'Top rated products for post-treatment care.'),
('Finance Your Face', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop', 'finance', false, 'user', 'Spread the cost of your treatments with 0% interest.'),

-- B2B ADS
('Wholesale Fillers', 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop', 'product', false, 'clinic', 'Best prices on premium dermal fillers.');
