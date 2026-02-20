export interface QuizQuestionOption {
  id: string;
  key: string;
  correct: boolean;
  answer?: string;
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  order: number;
  questionKey: string;
  question?: string;
  options: QuizQuestionOption[];
}

export interface QuizContentService {
  getQuestionsForModule(
    moduleId: string,
    locale: import('@/i18n').SupportedLocale,
  ): Promise<QuizQuestion[]>;
}
