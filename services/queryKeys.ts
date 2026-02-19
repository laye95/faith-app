export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
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
    },
    moduleProgress: {
      byUserModule: (userId: string, moduleId: string) =>
        ['progress', 'moduleProgress', userId, moduleId] as const,
      overview: (userId: string) =>
        ['progress', 'moduleProgress', 'overview', userId] as const,
    },
  },
} as const;
