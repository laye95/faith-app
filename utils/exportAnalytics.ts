import type {
  BibleschoolAnalytics,
  QuizAnalytics,
  TimeAnalytics,
} from '@/types/analytics';

function escapeCsvCell(value: string | number): string {
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildAnalyticsCsv(
  analytics: BibleschoolAnalytics | null,
  quizAnalytics: QuizAnalytics | null,
  timeAnalytics: TimeAnalytics | null,
  moduleLabels?: Record<string, string>,
): string {
  const sections: string[] = [];

  sections.push('Bible School Analytics Export');
  sections.push(`Exported: ${new Date().toISOString()}`);
  sections.push('');

  if (analytics) {
    sections.push('Total Users');
    sections.push(escapeCsvCell(analytics.totalUsers));
    sections.push('');

    sections.push('Module Completion');
    sections.push('Module,Completed,In Progress,Locked,Total');
    for (const stat of analytics.moduleStats) {
      const mod =
        moduleLabels?.[stat.moduleId] ?? stat.moduleId;
      const total =
        stat.completedCount + stat.inProgressCount + stat.lockedCount;
      sections.push(
        [
          escapeCsvCell(mod),
          escapeCsvCell(stat.completedCount),
          escapeCsvCell(stat.inProgressCount),
          escapeCsvCell(stat.lockedCount),
          escapeCsvCell(total),
        ].join(','),
      );
    }
    sections.push('');
  }

  if (quizAnalytics && quizAnalytics.moduleStats.length > 0) {
    sections.push('Quiz Performance');
    sections.push(
      'Module,Attempts,Passed,Failed,Avg Score %,Retry Count',
    );
    for (const stat of quizAnalytics.moduleStats) {
      const mod = moduleLabels?.[stat.moduleId] ?? stat.moduleId;
      sections.push(
        [
          escapeCsvCell(mod),
          escapeCsvCell(stat.attemptCount),
          escapeCsvCell(stat.passedCount),
          escapeCsvCell(stat.failedCount),
          escapeCsvCell(stat.avgScore),
          escapeCsvCell(stat.retryCount),
        ].join(','),
      );
    }
    sections.push('');
  }

  if (timeAnalytics) {
    sections.push('Active Users');
    sections.push(`Last 7 days,${timeAnalytics.activeUsersLast7Days}`);
    sections.push(`Last 30 days,${timeAnalytics.activeUsersLast30Days}`);
    sections.push('');

    if (timeAnalytics.newUsersByDay.length > 0) {
      sections.push('New Users by Day');
      sections.push('Date,Count');
      for (const p of timeAnalytics.newUsersByDay) {
        sections.push([escapeCsvCell(p.date), escapeCsvCell(p.count)].join(','));
      }
      sections.push('');
    }

    if (timeAnalytics.moduleCompletionsByDay.length > 0) {
      sections.push('Module Completions by Day');
      sections.push('Date,Count');
      for (const p of timeAnalytics.moduleCompletionsByDay) {
        sections.push([escapeCsvCell(p.date), escapeCsvCell(p.count)].join(','));
      }
      sections.push('');
    }
  }

  return sections.join('\n');
}
