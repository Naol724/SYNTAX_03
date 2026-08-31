/**
 * Dashboard Service
 * Aggregates statistics and recent activity for the admin dashboard.
 */

import { query } from '../config/database';
import { messageRepository } from '../repositories/message.repository';
import { DashboardStats } from '../types';

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [counts, messageStats, recentActivity] = await Promise.all([
      this.getCounts(),
      messageRepository.getStats(),
      this.getRecentActivity(),
    ]);

    return {
      totalServices: counts.services,
      totalPortfolio: counts.portfolio,
      totalBlogs: counts.blogs,
      totalTestimonials: counts.testimonials,
      totalDevelopers: counts.developers,
      totalMessages: counts.messages,
      unreadMessages: messageStats.unread_count,
      urgentMessages: messageStats.urgent_count,
      totalUsers: counts.users,
      totalViews: counts.views,
      recentActivity,
    };
  }

  private async getCounts(): Promise<{
    services: number;
    portfolio: number;
    blogs: number;
    testimonials: number;
    developers: number;
    messages: number;
    users: number;
    views: number;
  }> {
    const result = await query<{
      services: string;
      portfolio: string;
      blogs: string;
      testimonials: string;
      developers: string;
      messages: string;
      users: string;
      total_views: string;
    }>(`
      SELECT
        (SELECT COUNT(*) FROM services WHERE is_active = true)    AS services,
        (SELECT COUNT(*) FROM portfolio WHERE is_published = true) AS portfolio,
        (SELECT COUNT(*) FROM blog WHERE is_published = true)      AS blogs,
        (SELECT COUNT(*) FROM testimonials WHERE is_approved = true) AS testimonials,
        (SELECT COUNT(*) FROM developers WHERE is_active = true)   AS developers,
        (SELECT COUNT(*) FROM messages)                            AS messages,
        (SELECT COUNT(*) FROM users)                               AS users,
        (SELECT COALESCE(SUM(views_count), 0) FROM blog) +
        (SELECT COALESCE(SUM(views_count), 0) FROM portfolio)      AS total_views
    `);

    const row = result.rows[0];
    return {
      services: parseInt(row?.services ?? '0'),
      portfolio: parseInt(row?.portfolio ?? '0'),
      blogs: parseInt(row?.blogs ?? '0'),
      testimonials: parseInt(row?.testimonials ?? '0'),
      developers: parseInt(row?.developers ?? '0'),
      messages: parseInt(row?.messages ?? '0'),
      users: parseInt(row?.users ?? '0'),
      views: parseInt(row?.total_views ?? '0'),
    };
  }

  private async getRecentActivity() {
    try {
      const result = await query<{
        activity_type: string;
        activity_id: string;
        title: string;
        created_at: Date;
      }>('SELECT * FROM get_recent_activity(10)');
      return result.rows;
    } catch {
      // Function may not exist yet — return empty array gracefully
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
