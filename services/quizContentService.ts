import type { SupportedLocale } from '@/i18n';
import { getMockQuestionsForModule } from '@/constants/quizQuestions';
import { bibleschoolService } from '@/services/storyblok/bibleschoolService';
import type { QuizContentService, QuizQuestion } from '@/types/quiz';

class QuizContentServiceImpl implements QuizContentService {
  async getQuestionsForModule(
    moduleId: string,
    locale: SupportedLocale,
  ): Promise<QuizQuestion[]> {
    const module = await bibleschoolService.getModule(moduleId, locale);
    if (module?.examQuestions?.length) {
      return module.examQuestions;
    }
    return getMockQuestionsForModule(moduleId);
  }
}

export const quizContentService = new QuizContentServiceImpl();
