-- Row Level Security (RLS) Policies for Mekiya Real Estate Platform
-- This ensures data is properly secured at the database level

-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."visit_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."neighborhoods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- HELPER FUNCTION: Get current user role
-- ========================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
DECLARE
  user_email TEXT;
  user_rec RECORD;
BEGIN
  -- Get email from JWT token
  user_email := current_setting('request.jwt.claims', true)::json->>'email';
  
  IF user_email IS NULL THEN
    RETURN 'public'::user_role;
  END IF;
  
  -- Look up user role
  SELECT role INTO user_rec FROM users WHERE email = user_email;
  
  IF user_rec IS NULL THEN
    RETURN 'public'::user_role;
  END IF;
  
  RETURN user_rec.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- HELPER FUNCTION: Get current user ID
-- ========================================

CREATE OR REPLACE FUNCTION get_user_id()
RETURNS INTEGER AS $$
DECLARE
  user_email TEXT;
  user_rec RECORD;
BEGIN
  user_email := current_setting('request.jwt.claims', true)::json->>'email';
  
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT id INTO user_rec FROM users WHERE email = user_email;
  
  RETURN user_rec.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- HELPER FUNCTION: Check if user is staff
-- ========================================

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('agent', 'sales_manager', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Public can view agent profiles (for public agent directory)
CREATE POLICY "Public can view agents"
ON "public"."users"
FOR SELECT
USING (
  role IN ('agent', 'sales_manager')
);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "public"."users"
FOR SELECT
USING (
  id = get_user_id()
);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON "public"."users"
FOR UPDATE
USING (
  id = get_user_id()
)
WITH CHECK (
  id = get_user_id() AND
  role = (SELECT role FROM users WHERE id = get_user_id()) -- Prevent role change
);

-- Only super_admin can manage users
CREATE POLICY "Super admin can manage all users"
ON "public"."users"
FOR ALL
USING (
  get_user_role() = 'super_admin'
);

-- ========================================
-- PROPERTIES TABLE POLICIES
-- ========================================

-- Everyone can view published properties
CREATE POLICY "Anyone can view published properties"
ON "public"."properties"
FOR SELECT
USING (
  status = 'published' OR
  agent_id = get_user_id() OR
  is_staff()
);

-- Agents can create properties
CREATE POLICY "Agents can create properties"
ON "public"."properties"
FOR INSERT
WITH CHECK (
  is_staff() AND
  (agent_id = get_user_id() OR get_user_role() IN ('sales_manager', 'super_admin'))
);

-- Agents can update their own properties, managers can update all
CREATE POLICY "Agents can update own properties"
ON "public"."properties"
FOR UPDATE
USING (
  agent_id = get_user_id() OR
  get_user_role() IN ('sales_manager', 'super_admin')
)
WITH CHECK (
  agent_id = get_user_id() OR
  get_user_role() IN ('sales_manager', 'super_admin')
);

-- Only managers and admins can delete properties
CREATE POLICY "Managers can delete properties"
ON "public"."properties"
FOR DELETE
USING (
  get_user_role() IN ('sales_manager', 'super_admin')
);

-- ========================================
-- VISIT REQUESTS TABLE POLICIES
-- ========================================

-- Anyone can create visit requests (even unauthenticated)
CREATE POLICY "Anyone can create visit requests"
ON "public"."visit_requests"
FOR INSERT
WITH CHECK (true);

-- Staff can view all visit requests
CREATE POLICY "Staff can view visit requests"
ON "public"."visit_requests"
FOR SELECT
USING (
  is_staff()
);

-- Assigned agents can view their visit requests
CREATE POLICY "Agents can view assigned visits"
ON "public"."visit_requests"
FOR SELECT
USING (
  assigned_agent_id = get_user_id()
);

-- Staff can update visit requests
CREATE POLICY "Staff can update visit requests"
ON "public"."visit_requests"
FOR UPDATE
USING (
  is_staff()
)
WITH CHECK (
  is_staff()
);

-- ========================================
-- LEADS TABLE POLICIES
-- ========================================

-- Anyone can create leads (contact forms)
CREATE POLICY "Anyone can create leads"
ON "public"."leads"
FOR INSERT
WITH CHECK (true);

-- Staff can view all leads
CREATE POLICY "Staff can view all leads"
ON "public"."leads"
FOR SELECT
USING (
  is_staff()
);

-- Assigned agents can view their leads
CREATE POLICY "Agents can view assigned leads"
ON "public"."leads"
FOR SELECT
USING (
  assigned_agent_id = get_user_id()
);

-- Agents can update their assigned leads
CREATE POLICY "Agents can update assigned leads"
ON "public"."leads"
FOR UPDATE
USING (
  assigned_agent_id = get_user_id() OR
  get_user_role() IN ('sales_manager', 'super_admin')
)
WITH CHECK (
  assigned_agent_id = get_user_id() OR
  get_user_role() IN ('sales_manager', 'super_admin')
);

-- Managers can delete leads
CREATE POLICY "Managers can delete leads"
ON "public"."leads"
FOR DELETE
USING (
  get_user_role() IN ('sales_manager', 'super_admin')
);

-- ========================================
-- TRANSACTIONS TABLE POLICIES
-- ========================================

-- Staff can view all transactions
CREATE POLICY "Staff can view transactions"
ON "public"."transactions"
FOR SELECT
USING (
  is_staff()
);

-- Staff can create transactions
CREATE POLICY "Staff can create transactions"
ON "public"."transactions"
FOR INSERT
WITH CHECK (
  is_staff()
);

-- Only managers and admins can update/delete transactions
CREATE POLICY "Managers can manage transactions"
ON "public"."transactions"
FOR ALL
USING (
  get_user_role() IN ('sales_manager', 'super_admin')
);

-- ========================================
-- TESTIMONIALS TABLE POLICIES
-- ========================================

-- Everyone can view featured testimonials
CREATE POLICY "Anyone can view featured testimonials"
ON "public"."testimonials"
FOR SELECT
USING (
  featured = true OR
  is_staff()
);

-- Staff can manage testimonials
CREATE POLICY "Staff can manage testimonials"
ON "public"."testimonials"
FOR ALL
USING (
  is_staff()
);

-- ========================================
-- NEIGHBORHOODS TABLE POLICIES
-- ========================================

-- Everyone can view neighborhoods
CREATE POLICY "Anyone can view neighborhoods"
ON "public"."neighborhoods"
FOR SELECT
USING (true);

-- Staff can manage neighborhoods
CREATE POLICY "Staff can manage neighborhoods"
ON "public"."neighborhoods"
FOR ALL
USING (
  is_staff()
);

-- ========================================
-- SITE SETTINGS TABLE POLICIES
-- ========================================

-- Everyone can view site settings
CREATE POLICY "Anyone can view site settings"
ON "public"."site_settings"
FOR SELECT
USING (true);

-- Only super admin can manage site settings
CREATE POLICY "Super admin can manage settings"
ON "public"."site_settings"
FOR ALL
USING (
  get_user_role() = 'super_admin'
);

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================
-- INDEXES FOR RLS PERFORMANCE
-- ========================================

-- Index on email for user lookups in RLS functions
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Additional indexes for common RLS queries
CREATE INDEX IF NOT EXISTS idx_properties_agent_status ON properties(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_visit_requests_assigned_agent ON visit_requests(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_agent_status ON leads(assigned_agent_id, pipeline_status);

-- ========================================
-- COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON FUNCTION get_user_role() IS 'Returns the role of the current authenticated user from JWT token';
COMMENT ON FUNCTION get_user_id() IS 'Returns the ID of the current authenticated user from JWT token';
COMMENT ON FUNCTION is_staff() IS 'Returns true if current user is staff (agent, sales_manager, or super_admin)';
