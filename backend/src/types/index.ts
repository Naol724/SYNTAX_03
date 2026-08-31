/**
 * Shared TypeScript Types
 * Used across controllers, services, and repositories.
 */

import { Request } from 'express';

// =====================================================
// AUTHENTICATED REQUEST
// =====================================================
export interface AuthPayload {
  admin_id: string;
  email: string;
  username: string;
  role: 'admin' | 'super_admin';
  iat: number;
  exp: number;
}

/** Extended Express Request with auth payload */
export interface AuthRequest extends Request {
  admin?: AuthPayload;
}

// =====================================================
// PAGINATION
// =====================================================
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// =====================================================
// SORT & FILTER
// =====================================================
export type SortOrder = 'ASC' | 'DESC';

export interface SortParams {
  field: string;
  order: SortOrder;
}

// =====================================================
// QUERY OPTIONS
// =====================================================
export interface QueryOptions {
  pagination?: PaginationParams;
  sort?: SortParams;
  search?: string;
}

// =====================================================
// UPLOAD
// =====================================================
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// =====================================================
// HEALTH CHECK
// =====================================================
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
  };
  version: string;
}

// =====================================================
// SEND CHAT MESSAGE INPUT (used in chat service)
// =====================================================
export interface SendChatMessageInput {
  message: string;
  session_id?: string;
  context?: Record<string, any>;
}

// =====================================================
// INLINE TYPE DEFINITIONS
// (matching database schema to avoid import path issues)
// =====================================================

export type AdminRole = 'admin' | 'super_admin';
export type MessageStatus = 'unread' | 'read' | 'archived' | 'responded';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';
export type MessageType = 'inquiry' | 'support' | 'feedback';

export interface Admin {
  admin_id: string;
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

export type SafeAdmin = Omit<Admin, 'password_hash'>;

export interface User {
  user_id: string;
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

export interface Service {
  service_id: string;
  admin_id: string;
  name: string;
  type: string;
  property: Record<string, any> | null;
  language: string[] | null;
  description: string;
  short_description: string | null;
  icon_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Portfolio {
  portfolio_id: string;
  admin_id: string;
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

export interface Blog {
  blog_id: string;
  admin_id: string;
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

export interface Testimonial {
  testimonial_id: string;
  portfolio_id: string | null;
  admin_id: string;
  client_name: string;
  project_type: string | null;
  position_work: string | null;
  company_name: string | null;
  location: string | null;
  feedback: string;
  rating: number;
  avatar_url: string | null;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Developer {
  developer_id: string;
  admin_id: string;
  full_name: string;
  skill: string[];
  position: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  phone_number: string | null;
  social_media_links: Record<string, string> | null;
  years_of_experience: number | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  message_id: string;
  user_id: string | null;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string;
  message: string;
  message_type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  admin_notes: string | null;
  responded_by: string | null;
  responded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AIChatAssistant {
  chat_id: string;
  user_id: string | null;
  session_id: string;
  user_message: string;
  ai_response: string;
  context: Record<string, any> | null;
  response_time_ms: number | null;
  tokens_used: number | null;
  was_helpful: boolean | null;
  feedback: string | null;
  created_at: Date;
}

export interface RefreshToken {
  token_id: string;
  admin_id: string;
  token_hash: string;
  expires_at: Date;
  is_revoked: boolean;
  revoked_at: Date | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: Date;
}

// =====================================================
// DTO TYPES
// =====================================================

export interface CreateAdminDTO {
  username: string;
  email: string;
  password: string;
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

export type UpdateServiceDTO = Partial<CreateServiceDTO>;

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
  completion_date?: Date | string;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
}

export type UpdatePortfolioDTO = Partial<CreatePortfolioDTO>;

export interface CreateBlogDTO {
  title: string;
  slug?: string;
  content: string;
  category: string;
  excerpt?: string;
  featured_image_url?: string;
  tags?: string[];
  author_name?: string;
  publish_date?: string;
  is_published?: boolean;
  is_featured?: boolean;
  read_time_minutes?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export type UpdateBlogDTO = Partial<CreateBlogDTO>;

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

export type UpdateTestimonialDTO = Partial<CreateTestimonialDTO>;

export interface CreateDeveloperDTO {
  full_name: string;
  skill: string[];
  position: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  phone_number?: string;
  social_media_links?: Record<string, string>;
  years_of_experience?: number;
  is_active?: boolean;
  display_order?: number;
}

export type UpdateDeveloperDTO = Partial<CreateDeveloperDTO>;

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

export interface CreateRefreshTokenDTO {
  admin_id: string;
  token_hash: string;
  expires_at: Date;
  user_agent?: string;
  ip_address?: string;
}

// =====================================================
// RESPONSE TYPES
// =====================================================

export interface AuthResponse {
  admin: SafeAdmin;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MessageStats {
  unread_count: number;
  read_count: number;
  responded_count: number;
  urgent_count: number;
  today_count: number;
}

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
  recentActivity: {
    activity_type: string;
    activity_id: string;
    title: string;
    created_at: Date;
  }[];
}
