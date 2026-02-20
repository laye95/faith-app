export interface ModuleStat {
  moduleId: string;
  completedCount: number;
  inProgressCount: number;
  lockedCount: number;
}

export interface BibleschoolAnalytics {
  totalUsers: number;
  moduleStats: ModuleStat[];
}

export interface QuizModuleStat {
  moduleId: string;
  attemptCount: number;
  passedCount: number;
  failedCount: number;
  avgScore: number;
  retryCount: number;
}

export interface QuizAnalytics {
  moduleStats: QuizModuleStat[];
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface TimeAnalytics {
  newUsersByDay: TimeSeriesPoint[];
  lessonCompletionsByDay: TimeSeriesPoint[];
  moduleCompletionsByDay: TimeSeriesPoint[];
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string;
  lastActivity: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  totalCount: number;
}

export interface AdminUserModuleProgress {
  moduleId: string;
  status: string;
  progressPercentage: number;
  completedAt: string | null;
}

export interface AdminUserQuizAttempt {
  moduleId: string;
  attemptNumber: number;
  scorePercentage: number;
  passed: boolean;
  completedAt: string;
}

export interface AdminUserDetail {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  lessonCompletedCount: number;
  moduleProgress: AdminUserModuleProgress[];
  quizAttempts: AdminUserQuizAttempt[];
}
