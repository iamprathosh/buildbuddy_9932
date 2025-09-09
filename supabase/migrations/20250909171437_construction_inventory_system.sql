-- Location: supabase/migrations/20250909171437_construction_inventory_system.sql
-- Schema Analysis: Fresh project with no existing database schema
-- Integration Type: Complete new construction inventory management system with authentication
-- Dependencies: None (creating base schema)

-- 1. Create custom types for the construction inventory system
CREATE TYPE public.user_role AS ENUM ('super_admin', 'project_manager', 'worker');
CREATE TYPE public.project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE public.transaction_type AS ENUM ('pull', 'receive', 'return');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- 2. Core Tables - User profiles (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'worker'::public.user_role,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    job_number TEXT UNIQUE NOT NULL,
    project_manager_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.project_status DEFAULT 'planning'::public.project_status,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product categories and units
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products/Inventory items
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    unit_of_measure TEXT NOT NULL,
    current_stock INTEGER DEFAULT 0 CHECK (current_stock >= 0),
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 1000,
    mauc DECIMAL(10,2) DEFAULT 0.00, -- Moving Average Unit Cost
    supplier TEXT,
    location TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Stock transactions
CREATE TABLE public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    transaction_type public.transaction_type NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2),
    notes TEXT,
    transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Project assignments (workers to projects)
CREATE TABLE public.project_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    assigned_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(project_id, user_id)
);

-- 8. Essential Indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_projects_manager_id ON public.projects(project_manager_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_job_number ON public.projects(job_number);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_current_stock ON public.products(current_stock);
CREATE INDEX idx_stock_transactions_product_id ON public.stock_transactions(product_id);
CREATE INDEX idx_stock_transactions_project_id ON public.stock_transactions(project_id);
CREATE INDEX idx_stock_transactions_user_id ON public.stock_transactions(user_id);
CREATE INDEX idx_stock_transactions_date ON public.stock_transactions(transaction_date);
CREATE INDEX idx_project_assignments_project_id ON public.project_assignments(project_id);
CREATE INDEX idx_project_assignments_user_id ON public.project_assignments(user_id);

-- 9. Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'worker'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Function to update stock levels after transactions
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update current stock based on transaction type
    IF NEW.transaction_type = 'receive' OR NEW.transaction_type = 'return' THEN
        UPDATE public.products 
        SET current_stock = current_stock + NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.product_id;
    ELSIF NEW.transaction_type = 'pull' THEN
        UPDATE public.products 
        SET current_stock = GREATEST(0, current_stock - NEW.quantity),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Function for role-based access using auth metadata
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('super_admin', 'project_manager')
)
$$;

-- 10. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies using the 7-pattern system

-- Pattern 1: Core User Tables (user_profiles) - Simple ownership
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public Read, Private Write (product_categories)
CREATE POLICY "public_can_read_product_categories"
ON public.product_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manager_can_manage_categories"
ON public.product_categories
FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

-- Pattern 4: Public Read, Admin/Manager Write (products)
CREATE POLICY "authenticated_can_read_products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manager_can_manage_products"
ON public.products
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

-- Pattern 6: Role-based access (projects)
CREATE POLICY "users_can_view_assigned_projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
    project_manager_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.project_assignments pa 
        WHERE pa.project_id = id AND pa.user_id = auth.uid() AND pa.is_active = true
    ) OR
    public.is_admin_or_manager()
);

CREATE POLICY "admin_manager_can_manage_projects"
ON public.projects
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

-- Pattern 2: Simple user ownership (stock_transactions)
CREATE POLICY "users_manage_own_stock_transactions"
ON public.stock_transactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow viewing all transactions for admin/managers
CREATE POLICY "admin_manager_can_view_all_transactions"
ON public.stock_transactions
FOR SELECT
TO authenticated
USING (public.is_admin_or_manager());

-- Pattern 6: Role-based access (project_assignments)
CREATE POLICY "users_can_view_relevant_assignments"
ON public.project_assignments
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR 
    public.is_admin_or_manager() OR
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND p.project_manager_id = auth.uid()
    )
);

CREATE POLICY "admin_manager_can_manage_assignments"
ON public.project_assignments
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_stock_transaction_created
    AFTER INSERT ON public.stock_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_product_stock();

-- 13. Mock Data for testing
DO $$
DECLARE
    super_admin_uuid UUID := gen_random_uuid();
    project_manager_uuid UUID := gen_random_uuid();
    worker1_uuid UUID := gen_random_uuid();
    worker2_uuid UUID := gen_random_uuid();
    project1_uuid UUID := gen_random_uuid();
    project2_uuid UUID := gen_random_uuid();
    category_cement_uuid UUID := gen_random_uuid();
    category_steel_uuid UUID := gen_random_uuid();
    category_lumber_uuid UUID := gen_random_uuid();
    category_plumbing_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    product3_uuid UUID := gen_random_uuid();
    product4_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (super_admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@buildbuddy.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Administrator", "role": "super_admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (project_manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@buildbuddy.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Project Manager", "role": "project_manager"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (worker1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'worker1@buildbuddy.com', crypt('worker123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Construction Worker 1", "role": "worker"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (worker2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'worker2@buildbuddy.com', crypt('worker123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Construction Worker 2", "role": "worker"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create projects
    INSERT INTO public.projects (id, name, description, job_number, project_manager_id, status, budget, location) VALUES
        (project1_uuid, 'Downtown Office Complex', 'Modern office building with 20 floors', 'JOB-2024-001', project_manager_uuid, 'active'::public.project_status, 2500000.00, 'Downtown District'),
        (project2_uuid, 'Residential Subdivision Phase 2', 'Second phase of suburban housing development', 'JOB-2024-002', project_manager_uuid, 'planning'::public.project_status, 1800000.00, 'North Suburbs');

    -- Create product categories
    INSERT INTO public.product_categories (id, name, description) VALUES
        (category_cement_uuid, 'Cement', 'Cement and concrete products'),
        (category_steel_uuid, 'Steel', 'Steel reinforcement and structural materials'),
        (category_lumber_uuid, 'Lumber', 'Wood and lumber products'),
        (category_plumbing_uuid, 'Plumbing', 'Pipes, fittings, and plumbing supplies');

    -- Create products
    INSERT INTO public.products (id, sku, name, description, category_id, unit_of_measure, current_stock, min_stock_level, max_stock_level, mauc, supplier, location, image_url) VALUES
        (product1_uuid, 'CEM-001', 'Portland Cement Type I', 'High-quality Portland cement for general construction use', category_cement_uuid, 'Bags', 150, 50, 500, 12.50, 'ABC Cement Co.', 'Warehouse A-1', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center'),
        (product2_uuid, 'STL-002', 'Rebar #4 Grade 60', 'Standard reinforcement bar for concrete structures', category_steel_uuid, 'Pieces', 75, 25, 200, 8.75, 'Steel Supply Inc.', 'Yard B-2', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&crop=center'),
        (product3_uuid, 'LBR-004', '2x4x8 Pressure Treated Lumber', 'Pressure treated lumber for framing and construction', category_lumber_uuid, 'Pieces', 200, 100, 1000, 6.25, 'Timber Works', 'Lumber Shed D-1', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&crop=center'),
        (product4_uuid, 'PIP-006', '4" PVC Pipe Schedule 40', 'Standard PVC pipe for drainage and sewer applications', category_plumbing_uuid, 'Feet', 500, 200, 2000, 3.75, 'Plumbing Supply Co.', 'Warehouse E-1', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center');

    -- Create project assignments
    INSERT INTO public.project_assignments (project_id, user_id) VALUES
        (project1_uuid, worker1_uuid),
        (project1_uuid, worker2_uuid),
        (project2_uuid, worker1_uuid);

    -- Create sample stock transactions
    INSERT INTO public.stock_transactions (product_id, project_id, user_id, transaction_type, quantity, unit_cost, notes) VALUES
        (product1_uuid, project1_uuid, worker1_uuid, 'receive', 50, 12.50, 'Initial stock delivery'),
        (product2_uuid, project1_uuid, worker2_uuid, 'receive', 25, 8.75, 'Steel delivery for foundation'),
        (product1_uuid, project1_uuid, worker1_uuid, 'pull', 10, 12.50, 'Used for foundation pour');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;