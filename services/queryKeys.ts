export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
  admin: {
    bibleschoolAnalytics: (from?: string, to?: string) =>
      ['admin', 'bibleschoolAnalytics', from, to] as const,
    quizAnalytics: (from?: string, to?: string) =>
      ['admin', 'quizAnalytics', from, to] as const,
    timeAnalytics: (from?: string, to?: string) =>
      ['admin', 'timeAnalytics', from, to] as const,
    users: (limit: number, offset: number, search?: string) =>
      ['admin', 'users', limit, offset, search] as const,
    userDetail: (userId: string) => ['admin', 'userDetail', userId] as const,
  },
  vimeo: {
    playbackUrl: (videoId: string) => ['vimeo', 'playbackUrl', videoId] as const,
    thumbnailUrl: (videoId: string) => ['vimeo', 'thumbnailUrl', videoId] as const,
  },
  bibleschool: {
    category: (locale: string) => ['bibleschool', 'category', locale] as const,
  },
  userSettings: {
    introWatched: (userId: string) =>
      ['userSettings', 'introWatched', userId] as const,
    introPosition: (userId: string) =>
      ['userSettings', 'introPosition', userId] as const,
  },
  progress: {
    overview: (userId: string) => ['progress', 'overview', userId] as const,
    lesson: (userId: string, lessonId: string) =>
      ['progress', 'lesson', userId, lessonId] as const,
    module: (userId: string, moduleId: string) =>
      ['progress', 'module', userId, moduleId] as const,
    quizAttempts: (userId: string, moduleId: string) =>
      ['progress', 'quizAttempts', userId, moduleId] as const,
    lessonProgress: {
      byUserLesson: (userId: string, lessonId: string) =>
        ['progress', 'lessonProgress', userId, lessonId] as const,
      byUserModule: (userId: string, moduleId: string) =>
        ['progress', 'lessonProgress', userId, moduleId] as const,
      completedByUser: (userId: string) =>
        ['progress', 'lessonProgress', 'completedByUser', userId] as const,
      lastWatchedByUser: (userId: string) =>
        ['progress', 'lessonProgress', 'lastWatchedByUser', userId] as const,
    },
    moduleProgress: {
      byUserModule: (userId: string, moduleId: string) =>
        ['progress', 'moduleProgress', userId, moduleId] as const,
      overview: (userId: string) =>
        ['progress', 'moduleProgress', 'overview', userId] as const,
    },
  },
} as const;
