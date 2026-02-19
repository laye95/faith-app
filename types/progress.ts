export type ModuleStatus = 'locked' | 'in_progress' | 'completed';

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  module_id: string;
  completed: boolean;
  video_position_seconds: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonProgressInput {
  user_id: string;
  lesson_id: string;
  module_id: string;
  completed?: boolean;
  video_position_seconds?: number;
  completed_at?: string | null;
}

export interface UpdateLessonProgressInput {
  completed?: boolean;
  video_position_seconds?: number;
  completed_at?: string | null;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ModuleStatus;
  progress_percentage: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateModuleProgressInput {
  user_id: string;
  module_id: string;
  status?: ModuleStatus;
  progress_percentage?: number;
  completed_at?: string | null;
}

export interface UpdateModuleProgressInput {
  status?: ModuleStatus;
  progress_percentage?: number;
  completed_at?: string | null;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  module_id: string;
  attempt_number: number;
  score_percentage: number;
  passed: boolean;
  answers: Record<string, string> | null;
  completed_at: string;
  created_at: string;
}

export interface CreateQuizAttemptInput {
  user_id: string;
  module_id: string;
  attempt_number: number;
  score_percentage: number;
  passed: boolean;
  answers?: Record<string, string> | null;
  completed_at?: string;
}
