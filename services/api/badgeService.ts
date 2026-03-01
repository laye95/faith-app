import type { Badge, UserBadge } from '@/types/badge';

import { lessonProgressService } from './lessonProgressService';
import { moduleProgressService } from './moduleProgressService';
import { notificationService } from './notificationService';
import { streakService } from './streakService';
import { userSettingsService } from './userSettingsService';
import { BaseService } from './baseService';
import { supabase } from '@/services/supabase/client';

const INTRO_WATCHED_KEY = 'bibleschool.intro_video_watched';

class BadgeService extends BaseService {
  protected tableName = 'badges';

  async listAll(): Promise<Badge[]> {
    return this.list<Badge>({
      sort: [{ field: 'order', ascending: true }],
    });
  }
}

class UserBadgeService extends BaseService {
  protected tableName = 'user_badges';

  async listByUser(userId: string): Promise<UserBadge[]> {
    return this.list<UserBadge>({
      filters: [{ field: 'user_id', operator: 'eq', value: userId }],
      sort: [{ field: 'earned_at', ascending: false }],
    });
  }

  async createForUser(userId: string, badgeId: string): Promise<UserBadge> {
    return this.create<UserBadge>({ user_id: userId, badge_id: badgeId });
  }

  async batchCreateForUser(
    userId: string,
    badgeIds: string[],
  ): Promise<UserBadge[]> {
    if (badgeIds.length === 0) return [];
    const items = badgeIds.map((badge_id) => ({ user_id: userId, badge_id }));
    return this.batchCreate<UserBadge>(items);
  }
}

const badgeService = new BadgeService();
const userBadgeService = new UserBadgeService();

export async function getBadges(): Promise<Badge[]> {
  const data = await badgeService.listAll();
  return data ?? [];
}

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  return userBadgeService.listByUser(userId);
}

export async function checkAndAwardBadges(
  userId: string,
): Promise<{ badge: Badge }[]> {
  const [badges, earnedBadgeIds, completedLessons, moduleProgress, dbStreak] =
    await Promise.all([
      getBadges(),
      getUserBadges(userId).then((ub) => ub.map((u) => u.badge_id)),
      lessonProgressService.listCompletedByUser(userId),
      moduleProgressService.listByUser(userId),
      streakService.getStreak(userId).catch(() => null),
    ]);

  const quizPassedRows = await supabase
    .from('user_quiz_attempts')
    .select('id')
    .eq('user_id', userId)
    .eq('passed', true)
    .limit(1);
  const hasPassedQuiz = (quizPassedRows.data?.length ?? 0) > 0;

  const introWatched =
    (await userSettingsService.getSetting<boolean>(
      userId,
      INTRO_WATCHED_KEY,
    )) === true;

  const lessonCount = completedLessons.length;
  const completedModules = moduleProgress.filter(
    (m) => m.status === 'completed',
  );
  const moduleCount = completedModules.length;
  const streak = dbStreak?.days ?? 0;

  const completedModuleIds = new Set(completedModules.map((m) => m.module_id));

  const newlyEarned: { badge: Badge }[] = [];
  const badgeIdsToAward: string[] = [];

  for (const badge of badges) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    let qualifies = false;
    if (badge.id === 'first_lesson') {
      qualifies = lessonCount >= 1;
    } else if (badge.id.startsWith('lesson_milestone_')) {
      const target = badge.target_value;
      qualifies = lessonCount >= target;
    } else if (badge.id === 'student_van_het_woord') {
      qualifies = lessonCount >= 10;
    } else if (badge.id.startsWith('streak_')) {
      qualifies = streak >= badge.target_value;
    } else if (badge.id === 'volharder') {
      qualifies = streak >= 7;
    } else if (badge.id === 'strijder') {
      qualifies = hasPassedQuiz;
    } else if (badge.id === 'bijbelleraar') {
      qualifies = moduleCount >= 5;
    } else if (badge.id === 'faith_finisher') {
      qualifies = moduleCount >= 20;
    } else if (badge.id === 'schriftgeleerde') {
      qualifies = lessonCount >= 100;
    } else if (badge.id.startsWith('module_')) {
      const moduleNum = parseInt(badge.id.replace('module_', ''), 10);
      const moduleId = `module-${moduleNum}`;
      qualifies = completedModuleIds.has(moduleId);
    } else if (badge.id === 'intro_watched') {
      qualifies = introWatched;
    }

    if (qualifies) {
      newlyEarned.push({ badge });
      badgeIdsToAward.push(badge.id);
    }
  }

  if (badgeIdsToAward.length > 0) {
    try {
      await userBadgeService.batchCreateForUser(userId, badgeIdsToAward);
    } catch {
      return [];
    }
    await notificationService
      .createForBadges(userId, newlyEarned)
      .catch(() => {});
  }

  return newlyEarned;
}
