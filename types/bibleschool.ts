import type { QuizQuestion } from './quiz';

export interface BibleschoolModule {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  order: number;
  moduleHandoutUrl?: string;
  backgroundImageUrl?: string;
  lessons: BibleschoolLesson[];
  examQuestions?: QuizQuestion[];
}

export interface BibleschoolLesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoId?: string;
  content?: string;
  goal?: string;
  lessonHandoutUrl?: string;
  moduleHandoutUrl?: string;
}

export interface StoryblokStory<T = Record<string, unknown>> {
  uuid: string;
  id: number;
  slug: string;
  full_slug: string;
  content: T;
  position?: number;
  lang?: string;
}

export interface StoryblokStoriesResponse {
  stories: StoryblokStory[];
}

export interface StoryblokStoryResponse {
  story: StoryblokStory;
}

export interface StoryblokModuleContent {
  title?: string;
  description?: string;
  order?: number;
  lessonCount?: number;
  moduleHandoutUrl?: string;
  lessons?: StoryblokLessonBlock[];
}

export interface StoryblokLessonBlock {
  _uid: string;
  component: string;
  title?: string;
  content?: string;
  goal?: string;
  order?: number;
  thumbnailUrl?: string;
  videoId?: string;
  lessonHandoutUrl?: string;
}
