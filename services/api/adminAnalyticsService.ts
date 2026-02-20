import type {
  AdminUserDetail,
  AdminUsersResponse,
  BibleschoolAnalytics,
  QuizAnalytics,
  TimeAnalytics,
} from '@/types/analytics';

import { BaseService } from './baseService';

class AdminAnalyticsService extends BaseService {
  async getBibleschoolAnalytics(from?: string, to?: string): Promise<BibleschoolAnalytics> {
    const params = from && to ? { p_from: from, p_to: to } : {};
    return this.executeRpc<BibleschoolAnalytics>(
      'get_bibleschool_analytics',
      params as Record<string, unknown>,
    );
  }

  async getQuizAnalytics(from?: string, to?: string): Promise<QuizAnalytics> {
    const params = from && to ? { p_from: from, p_to: to } : {};
    return this.executeRpc<QuizAnalytics>(
      'get_quiz_analytics',
      params as Record<string, unknown>,
    );
  }

  async getTimeAnalytics(from?: string, to?: string): Promise<TimeAnalytics> {
    const fromDate =
      from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const toDate = to ?? new Date().toISOString();
    return this.executeRpc<TimeAnalytics>('get_admin_time_analytics', {
      p_from: fromDate,
      p_to: toDate,
    });
  }

  async getAdminUsers(
    limit = 50,
    offset = 0,
    search?: string,
  ): Promise<AdminUsersResponse> {
    return this.executeRpc<AdminUsersResponse>('get_admin_users', {
      p_limit: limit,
      p_offset: offset,
      p_search: search || null,
    });
  }

  async getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
    return this.executeRpc<AdminUserDetail | null>('get_admin_user_detail', {
      p_user_id: userId,
    });
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
