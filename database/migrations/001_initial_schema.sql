-- =====================================================
-- SYNTAX WEBSITE - INITIAL DATABASE SCHEMA
-- PostgreSQL Database Migration
-- Version: 1.0.0
-- Author: Senior Full Stack Engineer
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable timestamp extensions
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =====================================================
-- TABLE: admins
-- Description: Admin users with authentication
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for faster authentication lookups
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_active ON admins(is_active) WHERE is_active = true;

-- =====================================================
-- TABLE: users
-- Description: Registered users/clients
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    company_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for user lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_users_registration_date ON users(registration_date DESC);

-- =====================================================
-- TABLE: services
-- Description: Company services/offerings
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'web-development', 'mobile-app', 'consulting'
    property JSONB, -- Flexible properties like pricing, duration, etc.
    language VARCHAR(50)[], -- Programming languages: ['JavaScript', 'Python', 'Java']
    description TEXT NOT NULL,
    short_description VARCHAR(255),
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for service queries
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX idx_services_display_order ON services(display_order);
CREATE INDEX idx_services_language ON services USING GIN(language);

-- =====================================================
-- TABLE: portfolio
-- Description: Company portfolio/projects
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio (
    portfolio_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE SET NULL,
    project_name VARCHAR(150) NOT NULL,
    portfolio_type VARCHAR(50) NOT NULL, -- e.g., 'website', 'mobile-app', 'api'
    language_used VARCHAR(50)[], -- ['React', 'Node.js', 'PostgreSQL']
    project_link VARCHAR(500),
    github_link VARCHAR(500),
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    description TEXT NOT NULL,
    short_description VARCHAR(255),
    client_name VARCHAR(100),
    completion_date DATE,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for portfolio queries
CREATE INDEX idx_portfolio_type ON portfolio(portfolio_type);
CREATE INDEX idx_portfolio_featured ON portfolio(is_featured) WHERE is_featured = true;
CREATE INDEX idx_portfolio_published ON portfolio(is_published) WHERE is_published = true;
CREATE INDEX idx_portfolio_display_order ON portfolio(display_order);
CREATE INDEX idx_portfolio_language ON portfolio USING GIN(language_used);
CREATE INDEX idx_portfolio_completion_date ON portfolio(completion_date DESC);

-- =====================================================
-- TABLE: blog
-- Description: Blog posts and articles
-- =====================================================
CREATE TABLE IF NOT EXISTS blog (
    blog_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image_url VARCHAR(500),
    category VARCHAR(50) NOT NULL, -- 'technology', 'tutorial', 'news', etc.
    tags VARCHAR(50)[],
    author_name VARCHAR(100),
    publish_date TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER,
    seo_title VARCHAR(200),
    seo_description VARCHAR(300),
    seo_keywords VARCHAR(50)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for blog queries
CREATE INDEX idx_blog_slug ON blog(slug);
CREATE INDEX idx_blog_category ON blog(category);
CREATE INDEX idx_blog_published ON blog(is_published) WHERE is_published = true;
CREATE INDEX idx_blog_featured ON blog(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_publish_date ON blog(publish_date DESC);
CREATE INDEX idx_blog_tags ON blog USING GIN(tags);
CREATE INDEX idx_blog_search ON blog USING GIN(to_tsvector('english', title || ' ' || content));

-- =====================================================
-- TABLE: testimonials
-- Description: Client testimonials and reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolio(portfolio_id) ON DELETE SET NULL,
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE SET NULL,
    client_name VARCHAR(100) NOT NULL,
    project_type VARCHAR(50),
    position_work VARCHAR(100), -- Client's position
    company_name VARCHAR(100),
    location VARCHAR(100),
    feedback TEXT NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    avatar_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for testimonial queries
CREATE INDEX idx_testimonials_portfolio ON testimonials(portfolio_id);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved) WHERE is_approved = true;
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);

-- =====================================================
-- TABLE: developers
-- Description: Team members/developer profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS developers (
    developer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    skill VARCHAR(50)[] NOT NULL, -- ['React', 'Node.js', 'TypeScript']
    position VARCHAR(100) NOT NULL, -- 'Senior Full Stack Developer'
    bio TEXT,
    avatar_url VARCHAR(500),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    social_media_links JSONB, -- {'linkedin': 'url', 'github': 'url', 'twitter': 'url'}
    years_of_experience INTEGER,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for developer queries
CREATE INDEX idx_developers_active ON developers(is_active) WHERE is_active = true;
CREATE INDEX idx_developers_skill ON developers USING GIN(skill);
CREATE INDEX idx_developers_display_order ON developers(display_order);

-- =====================================================
-- TABLE: messages
-- Description: User messages/inquiries
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'inquiry', -- 'inquiry', 'support', 'feedback'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'archived', 'responded'
    admin_notes TEXT,
    responded_by UUID REFERENCES admins(admin_id) ON DELETE SET NULL,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for message queries
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_priority ON messages(priority);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_sender_email ON messages(sender_email);

-- =====================================================
-- TABLE: ai_chat_assistant
-- Description: AI chat conversation history
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_chat_assistant (
    chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB, -- Store conversation context
    response_time_ms INTEGER, -- Response time in milliseconds
    tokens_used INTEGER,
    was_helpful BOOLEAN,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for AI chat queries
CREATE INDEX idx_ai_chat_user ON ai_chat_assistant(user_id);
CREATE INDEX idx_ai_chat_session ON ai_chat_assistant(session_id);
CREATE INDEX idx_ai_chat_created_at ON ai_chat_assistant(created_at DESC);
CREATE INDEX idx_ai_chat_helpful ON ai_chat_assistant(was_helpful) WHERE was_helpful IS NOT NULL;

-- =====================================================
-- TABLE: refresh_tokens
-- Description: JWT refresh tokens for authentication
-- =====================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for token queries
CREATE INDEX idx_refresh_tokens_admin ON refresh_tokens(admin_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(is_revoked) WHERE is_revoked = false;

-- =====================================================
-- TABLE: analytics_events
-- Description: Track website analytics events
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'button_click', 'form_submit'
    event_category VARCHAR(50),
    event_label VARCHAR(100),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    session_id UUID,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(50),
    city VARCHAR(100),
    device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_device_type ON analytics_events(device_type);

-- =====================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON blog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS: Useful database views
-- =====================================================

-- View: Published portfolio with testimonial count
CREATE OR REPLACE VIEW vw_published_portfolio AS
SELECT 
    p.*,
    COUNT(DISTINCT t.testimonial_id) as testimonial_count,
    AVG(t.rating) as average_rating
FROM portfolio p
LEFT JOIN testimonials t ON p.portfolio_id = t.portfolio_id AND t.is_approved = true
WHERE p.is_published = true
GROUP BY p.portfolio_id;

-- View: Published blog posts with metadata
CREATE OR REPLACE VIEW vw_published_blogs AS
SELECT 
    blog_id,
    title,
    slug,
    excerpt,
    featured_image_url,
    category,
    tags,
    author_name,
    publish_date,
    is_featured,
    views_count,
    read_time_minutes
FROM blog
WHERE is_published = true
ORDER BY publish_date DESC;

-- View: Active services
CREATE OR REPLACE VIEW vw_active_services AS
SELECT 
    service_id,
    name,
    type,
    language,
    short_description,
    icon_url,
    display_order
FROM services
WHERE is_active = true
ORDER BY display_order;

-- View: Message statistics for admin dashboard
CREATE OR REPLACE VIEW vw_message_stats AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'unread') as unread_count,
    COUNT(*) FILTER (WHERE status = 'read') as read_count,
    COUNT(*) FILTER (WHERE status = 'responded') as responded_count,
    COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours') as today_count
FROM messages;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE admins IS 'Admin users with authentication credentials';
COMMENT ON TABLE users IS 'Registered website users/clients';
COMMENT ON TABLE services IS 'Company services and offerings';
COMMENT ON TABLE portfolio IS 'Portfolio projects and case studies';
COMMENT ON TABLE blog IS 'Blog posts and articles with SEO support';
COMMENT ON TABLE testimonials IS 'Client testimonials and reviews';
COMMENT ON TABLE developers IS 'Team member profiles';
COMMENT ON TABLE messages IS 'User inquiries and messages';
COMMENT ON TABLE ai_chat_assistant IS 'AI chatbot conversation history';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE analytics_events IS 'Website analytics and tracking events';

-- =====================================================
-- INITIAL DATA SEEDING (Optional)
-- =====================================================

-- Seed default admin (password: Admin@123 - CHANGE IN PRODUCTION!)
-- Password hash is bcrypt hash of 'Admin@123'
INSERT INTO admins (username, email, password_hash, full_name, role)
VALUES ('admin', 'admin@syntax.com', '$2b$10$YourHashHere', 'System Administrator', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions (adjust for your environment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
