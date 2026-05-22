-- -------------------------------------------------------------
-- PROOFFLOW AI — INITIAL DATABASE SCHEMA MIGRATION
-- -------------------------------------------------------------

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT,
    phone TEXT,
    website TEXT,
    owner_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Subscriptions Table (Stripe/PayPal integration)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'canceled', 'past_due')),
    monthly_generations_used INTEGER DEFAULT 0,
    current_period_end TIMESTAMP WITH TIME ZONE
);

-- 3. Create SEO Settings Table (25 business configuration answers)
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Knowledge Base Table (PDF/TXT uploads pointer)
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Job Reports Table (Before & After proof sheets)
CREATE TABLE IF NOT EXISTS public.job_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    technician_name TEXT,
    work_description TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    compiled_pdf_url TEXT,
    is_watermarked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Social Posts Table (SEO generated text assets)
CREATE TABLE IF NOT EXISTS public.social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    content_length TEXT NOT NULL,
    generated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Modules Table (WordPress-style Plugin Marketplace)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    plan_access TEXT DEFAULT 'free' CHECK (plan_access IN ('free', 'pro', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- SEO Settings Policies
CREATE POLICY "Users can manage own SEO settings" ON public.seo_settings
    FOR ALL USING (auth.uid() = user_id);

-- Knowledge Base Policies
CREATE POLICY "Users can manage own Knowledge Base" ON public.knowledge_base
    FOR ALL USING (auth.uid() = user_id);

-- Job Reports Policies
CREATE POLICY "Users can manage own reports" ON public.job_reports
    FOR ALL USING (auth.uid() = user_id);

-- Social Posts Policies
CREATE POLICY "Users can manage own social posts" ON public.social_posts
    FOR ALL USING (auth.uid() = user_id);

-- Modules Policies (Tradesmen can read active, Admins manage all)
CREATE POLICY "Anyone can view active modules" ON public.modules
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins have full access to modules" ON public.modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- -------------------------------------------------------------
-- AUTOMATED USER PROVISIONING TRIGGERS
-- -------------------------------------------------------------

-- Trigger function to automatically create profile and subscription records when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile record
  INSERT INTO public.profiles (id, company_name, owner_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'company_name', 'My Business'),
    COALESCE(new.raw_user_meta_data->>'owner_name', 'Owner')
  );

  -- Create default Free subscription record
  INSERT INTO public.subscriptions (user_id, plan_type, status, current_period_end)
  VALUES (new.id, 'free', 'active', now() + interval '1 month');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed initial basic modules into plugin registry
INSERT INTO public.modules (key, name, description, is_active, plan_access) VALUES
('reports', 'AI Before & After Reports', 'Upload before/after photos and generate customized, branded PDF proof sheets with warranty tags.', true, 'free'),
('social-posts', 'AI Social Posts Content', 'Write optimized copies for Facebook, GBP, Instagram, and LinkedIn tailored with location keywords.', true, 'free'),
('seo-wizard', 'SEO Setup Audit', '25 key business setup questions to fully optimize all generated copies and local rankings.', true, 'free'),
('captions', 'Smart Captions & Hashtags', 'Short visual hook ideas and trending localized hashtags to boost social media clicks.', true, 'free'),
('kb-facts', 'Business Memory Knowledge Base', 'Upload manuals, pricing tables, or brochures so generated materials remain 100% company-accurate.', true, 'free'),
('review-reply', 'AI Review Replier', 'Instantly draft responses to positive/negative customer reviews that target local keywords.', true, 'pro'),
('reel-hooks', 'AI Reel Generator & Audio Hooks', 'Script engaging, high-retention concepts for Instagram Reels and TikTok videos showcasing daily work.', true, 'pro'),
('website-copy', 'AI Website Copywriter', 'Generate local landing page structures, service lists, and headlines optimized for ranking on search engines.', true, 'pro'),
('auto-watermark', 'Auto Watermark Branding', 'Overlay your company logo on all uploaded work photos to protect copyright and boost recognition.', true, 'pro')
ON CONFLICT (key) DO NOTHING;
