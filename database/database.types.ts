/**
 * Database Types - SYNTAX Website
 * Auto-generated TypeScript types for PostgreSQL database schema
 * Version: 1.0.0
 * 
 * These types match the database schema defined in migrations/001_initial_schema.sql
 */

// =====================================================
// ENUMS AND CONSTANTS
// =====================================================

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  RESPONDED = 'responded'
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum MessageType {
  INQUIRY = 'inquiry',
  SUPPORT = 'support',
  FEEDBACK = 'feedback'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

// =====================================================
// TABLE TYPES
// =====================================================

/**
 * Admin users with authentication credentials
 */
export interface Admin {
  admin_id: string; // UUID
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Admin creation/update DTOs
 */
export interface CreateAdminDTO {
  username: string;
  email: string;
  password: string; // Plain password (will be hashed)
  full_name: string;
  role?: AdminRole;
  is_active?: boolean;
}

export interface UpdateAdminDTO {
  username?: string;
  email?: string;
  full_name?: string;
  role?: AdminRole;
  is_active?: boolean;
}

/**
 * Registered website users/clients
 */
export interface User {
  user_id: string; // UUID
  email: string;
  full_name: string;
  phone_number: string | null;
  company_name: string | null;
  is_active: boolean;
  registration_date: Date;
  last_activity: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  full_name: string;
  phone_number?: string;
  company_name?: string;
}

export interface UpdateUserDTO {
  email?: string;
  full_name?: string;
  phone_number?: string;
  company_name?: string;
  is_active?: boolean;
}

/**
 * Company services and offerings
 */
export interface Service {
  service_id: string; // UUID
  admin_id: string; // UUID
  name: string;
  type: string;
  property: Record<string, any> | null; // JSONB
  language: string[] | null;
  description: string;
  short_description: string | null;
  icon_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateServiceDTO {
  name: string;
  type: string;
  description: string;
  short_description?: string;
  language?: string[];
  property?: Record<string, any>;
  icon_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateServiceDTO {
  name?: string;
  type?: string;
  description?: string;
  short_description?: string;
  language?: string[];
  property?: Record<string, any>;
  icon_url?: string;
  is_active?: boolean;
  display_order?: number;
}

/**
 * Portfolio projects and case studies
 */
export interface Portfolio {
  portfolio_id: string; // UUID
  admin_id: string; // UUID
  project_name: string;
  portfolio_type: string;
  language_used: string[] | null;
  project_link: string | null;
  github_link: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  description: string;
  short_description: string | null;
  client_name: string | null;
  completion_date: Date | null;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePortfolioDTO {
  project_name: string;
  portfolio_type: string;
  description: string;
  language_used?: string[];
  project_link?: string;
  github_link?: string;
  image_url?: string;
  thumbnail_url?: string;
  short_description?: string;
  client_name?: string;
  completion_date?: Date;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
}

export interface UpdatePortfolioDTO extends Partial<CreatePortfolioDTO> {}

/**
 * Blog posts and articles with SEO support
 */
export interface Blog {
  blog_id: string; // UUID
  admin_id: string; // UUID
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string;
  tags: string[] | null;
  author_name: string | null;
  publish_date: Date | null;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  read_time_minutes: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBlogDTO {
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt?: string;
  featured_image_url?: string;
  tags?: string[];
  author_name?: string;
  publish_date?: Date;
  is_published?: boolean;
  is_featured?: boolean;
  read_time_minutes?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export interface UpdateBlogDTO extends Partial<CreateBlogDTO> {}

/**
 * Client testimonials and reviews
 */
export interface Testimonial {
  testimonial_id: string; // UUID
  portfolio_id: string | null; // UUID
  admin_id: string; // UUID
  client_name: string;
  project_type: string | null;
  position_work: string | null;
  company_name: string | null;
  location: string | null;
  feedback: string;
  rating: number; // 0-5
  avatar_url: string | null;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTestimonialDTO {
  client_name: string;
  feedback: string;
  rating: number;
  portfolio_id?: string;
  project_type?: string;
  position_work?: string;
  company_name?: string;
  location?: string;
  avatar_url?: string;
  is_featured?: boolean;
  is_approved?: boolean;
  display_order?: number;
}

export interface UpdateTestimonialDTO extends Partial<CreateTestimonialDTO> {}

/**
 * Team member profiles
 */
export interface Developer {
  developer_id: string; // UUID
  admin_id: string; // UUID
  full_name: string;
  skill: string[];
  position: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  phone_number: string | null;
  social_media_links: Record<string, string> | null; // JSONB
  years_of_experience: number | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDeveloperDTO {
  full_name: string;
  skill: string[];
  position: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  phone_number?: string;
  social_media_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  years_of_experience?: number;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateDeveloperDTO extends Partial<CreateDeveloperDTO> {}

/**
 * User inquiries and messages
 */
export interface Message {
  message_id: string; // UUID
  user_id: string | null; // UUID
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string;
  message: string;
  message_type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  admin_notes: string | null;
  responded_by: string | null; // UUID (admin_id)
  responded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMessageDTO {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  sender_phone?: string;
  message_type?: MessageType;
  priority?: MessagePriority;
  user_id?: string;
}

export interface UpdateMessageDTO {
  status?: MessageStatus;
  priority?: MessagePriority;
  admin_notes?: string;
  responded_by?: string;
  responded_at?: Date;
}

/**
 * AI chatbot conversation history
 */
export interface AIChatAssistant {
  chat_id: string; // UUID
  user_id: string | null; // UUID
  session_id: string; // UUID
  user_message: string;
  ai_response: string;
  context: Record<string, any> | null; // JSONB
  response_time_ms: number | null;
  tokens_used: number | null;
  was_helpful: boolean | null;
  feedback: string | null;
  created_at: Date;
}

export interface CreateAIChatDTO {
  user_message: string;
  ai_response: string;
  session_id: string;
  user_id?: string;
  context?: Record<string, any>;
  response_time_ms?: number;
  tokens_used?: number;
}

export interface UpdateAIChatDTO {
  was_helpful?: boolean;
  feedback?: string;
}

/**
 * JWT refresh tokens for authentication
 */
export interface RefreshToken {
  token_id: string; // UUID
  admin_id: string; // UUID
  token_hash: string;
  expires_at: Date;
  is_revoked: boolean;
  revoked_at: Date | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: Date;
}

export interface CreateRefreshTokenDTO {
  admin_id: string;
  token_hash: string;
  expires_at: Date;
  user_agent?: string;
  ip_address?: string;
}

/**
 * Website analytics and tracking events
 */
export interface AnalyticsEvent {
  event_id: string; // UUID
  event_type: string;
  event_category: string | null;
  event_label: string | null;
  user_id: string | null; // UUID
  session_id: string | null; // UUID
  page_url: string | null;
  referrer_url: string | null;
  user_agent: string | null;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  device_type: DeviceType | null;
  browser: string | null;
  metadata: Record<string, any> | null; // JSONB
  created_at: Date;
}

export interface CreateAnalyticsEventDTO {
  event_type: string;
  event_category?: string;
  event_label?: string;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer_url?: string;
  user_agent?: string;
  ip_address?: string;
  country?: string;
  city?: string;
  device_type?: DeviceType;
  browser?: string;
  metadata?: Record<string, any>;
}

// =====================================================
// VIEW TYPES
// =====================================================

/**
 * Published portfolio with testimonial aggregation
 */
export interface PublishedPortfolio extends Portfolio {
  testimonial_count: number;
  average_rating: number | null;
}

/**
 * Published blog posts (public view)
 */
export interface PublishedBlog {
  blog_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string;
  tags: string[] | null;
  author_name: string | null;
  publish_date: Date | null;
  is_featured: boolean;
  views_count: number;
  read_time_minutes: number | null;
}

/**
 * Active services (public view)
 */
export interface ActiveService {
  service_id: string;
  name: string;
  type: string;
  language: string[] | null;
  short_description: string | null;
  icon_url: string | null;
  display_order: number;
}

/**
 * Message statistics for admin dashboard
 */
export interface MessageStats {
  unread_count: number;
  read_count: number;
  responded_count: number;
  urgent_count: number;
  today_count: number;
}

// =====================================================
// QUERY RESULT TYPES
// =====================================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Recent activity for dashboard
 */
export interface RecentActivity {
  activity_type: 'blog' | 'portfolio' | 'message';
  activity_id: string;
  title: string;
  created_at: Date;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalServices: number;
  totalPortfolio: number;
  totalBlogs: number;
  totalTestimonials: number;
  totalDevelopers: number;
  totalMessages: number;
  unreadMessages: number;
  urgentMessages: number;
  totalUsers: number;
  totalViews: number;
  recentActivity: RecentActivity[];
}

// =====================================================
// AUTHENTICATION TYPES
// =====================================================

/**
 * JWT payload structure
 */
export interface JWTPayload {
  admin_id: string;
  email: string;
  username: string;
  role: AdminRole;
  iat: number; // Issued at
  exp: number; // Expiration
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  admin: Omit<Admin, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Standard API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    version: string;
  };
}

/**
 * Error response
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// =====================================================
// FILTER AND SORT TYPES
// =====================================================

/**
 * Query filters for blog
 */
export interface BlogFilters {
  category?: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  author_name?: string;
  search?: string;
}

/**
 * Query filters for portfolio
 */
export interface PortfolioFilters {
  portfolio_type?: string;
  language_used?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  client_name?: string;
}

/**
 * Query filters for messages
 */
export interface MessageFilters {
  status?: MessageStatus;
  priority?: MessagePriority;
  message_type?: MessageType;
  date_from?: Date;
  date_to?: Date;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

// =====================================================
// UTILITY TYPES
// =====================================================

/**
 * Omit password from Admin type for responses
 */
export type SafeAdmin = Omit<Admin, 'password_hash'>;

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number; // Connection pool size
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

/**
 * Supabase configuration
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

// =====================================================
// TYPE GUARDS
// =====================================================

/**
 * Type guard for Admin
 */
export function isAdmin(obj: any): obj is Admin {
  return (
    typeof obj === 'object' &&
    typeof obj.admin_id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.username === 'string'
  );
}

/**
 * Type guard for User
 */
export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.user_id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.full_name === 'string'
  );
}

// =====================================================
// EXPORTS
// =====================================================

export default {
  // Enums
  AdminRole,
  MessageStatus,
  MessagePriority,
  MessageType,
  DeviceType,
  
  // Type guards
  isAdmin,
  isUser,
};
