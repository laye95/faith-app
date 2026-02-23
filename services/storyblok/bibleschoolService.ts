import type { SupportedLocale } from '@/i18n';
import type { BibleschoolLesson, BibleschoolModule } from '@/types/bibleschool';
import type { QuizQuestion } from '@/types/quiz';
import { fetchStory } from './client';

const CATEGORY_SLUG_MAP: Record<SupportedLocale, string> = {
  en: 'bible-school-dutch',
  nl: 'bible-school-dutch',
  bg: 'bible-school-bulgarian',
  hi: 'bible-school-hindi',
  id: 'bible-school-indonesia',
};

function getCategorySlug(locale: SupportedLocale): string {
  return CATEGORY_SLUG_MAP[locale] ?? 'bible-school-dutch';
}

interface StoryblokBackground {
  filename?: string;
}

interface StoryblokLesson {
  _uid: string;
  title?: string;
  handout?: StoryblokBackground;
  thumbnail?: StoryblokBackground;
  thumbnail_url?: StoryblokBackground;
  poster?: StoryblokBackground;
  vimeo_id?: string;
  vimeoId?: string;
  video?:
    | { id?: string; link?: { url?: string }; url?: string }
    | string;
  description?: string;
  body?: Array<{ component?: string; vimeo_id?: string; video?: unknown }>;
}

interface StoryblokAnswer {
  _uid: string;
  answer: string;
  correct: boolean;
  explanation?: string;
}

interface StoryblokExamn {
  _uid: string;
  component?: string;
  question: string;
  answers?: StoryblokAnswer[];
  explanation?: string;
}

interface StoryblokModule {
  _uid: string;
  title?: string;
  handout?: StoryblokBackground;
  background?: StoryblokBackground;
  background_image?: StoryblokBackground;
  image?: StoryblokBackground;
  lessons?: StoryblokLesson[];
  examn?: StoryblokExamn[];
}

interface StoryblokCategoryContent {
  modules?: StoryblokModule[];
  introduction_vimeo_id?: string;
}

function getFilename(bg: StoryblokBackground | undefined): string | undefined {
  return bg?.filename;
}

const INTRO_VIDEO_FALLBACK_ID = '927139225';

function parseIntroductionVimeoId(raw: string | undefined): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  const match = raw.match(/(?:vimeo\.com\/(?:video\/)?|^)(\d+)/);
  return match ? match[1] : raw.replace(/\D/g, '') || undefined;
}

function extractVimeoId(lesson: StoryblokLesson): string | undefined {
  const raw =
    lesson.vimeo_id ??
    lesson.vimeoId ??
    (typeof lesson.video === 'string' ? lesson.video : undefined) ??
    (lesson.video && typeof lesson.video === 'object' && 'id' in lesson.video
      ? String((lesson.video as { id?: string }).id)
      : undefined) ??
    (lesson.video && typeof lesson.video === 'object' && 'link' in lesson.video
      ? (lesson.video as { link?: { url?: string } }).link?.url
      : undefined) ??
    (lesson.video && typeof lesson.video === 'object' && 'url' in lesson.video
      ? (lesson.video as { url?: string }).url
      : undefined) ??
    (lesson.body ?? []).find((b) => b.vimeo_id)?.vimeo_id;
  if (!raw || typeof raw !== 'string') return undefined;
  const match = raw.match(/(?:vimeo\.com\/(?:video\/)?|^)(\d+)/);
  return match ? match[1] : raw.replace(/\D/g, '') || undefined;
}

function mapOldModuleToBibleschool(
  m: StoryblokModule,
  moduleIndex: number,
): BibleschoolModule {
  const moduleId = `module-${moduleIndex + 1}`;
  const rawLessons = m.lessons ?? [];
  const moduleHandoutUrl = getFilename(m.handout);

  const lessons: BibleschoolLesson[] = rawLessons.map((l, lessonIdx) => ({
    id: `${moduleId}-lesson-${lessonIdx + 1}`,
    moduleId,
    order: lessonIdx + 1,
    title: l.title ?? '',
    content: l.description ?? '',
    goal: '',
    videoId: extractVimeoId(l),
    thumbnailUrl:
      getFilename(l.thumbnail) ??
      getFilename(l.thumbnail_url) ??
      getFilename(l.poster),
    lessonHandoutUrl: getFilename(l.handout),
    moduleHandoutUrl,
  }));

  const rawExamn = m.examn ?? [];
  const examQuestions: QuizQuestion[] = rawExamn.map((ex, qIdx) => ({
    id: `q-${ex._uid}`,
    moduleId,
    order: qIdx + 1,
    questionKey: '',
    question: ex.question ?? '',
    options: (ex.answers ?? []).map((ans, optIdx) => ({
      id: `opt-${ans._uid}`,
      key: '',
      correct: ans.correct ?? false,
      answer: ans.answer ?? '',
    })),
  }));

  return {
    id: moduleId,
    title: m.title ?? '',
    description: '',
    lessonCount: lessons.length,
    order: moduleIndex,
    moduleHandoutUrl,
    backgroundImageUrl:
      getFilename(m.background) ??
      getFilename(m.background_image) ??
      getFilename(m.image),
    lessons,
    examQuestions: examQuestions.length > 0 ? examQuestions : undefined,
  };
}

let cachedModules: BibleschoolModule[] | null = null;
let cachedLocale: SupportedLocale | null = null;
let cachedIntroductionVimeoId: string | null = null;

export async function getModules(
  locale: SupportedLocale,
): Promise<BibleschoolModule[]> {
  const slug = getCategorySlug(locale);
  const path = `categories/${slug}`;

  const { story } = await fetchStory<StoryblokCategoryContent>(path, {
    version: 'published',
  });

  const raw = story.content?.introduction_vimeo_id;
  cachedIntroductionVimeoId = parseIntroductionVimeoId(raw) ?? INTRO_VIDEO_FALLBACK_ID;

  const rawModules = story.content?.modules ?? [];
  const modules = rawModules.map((m, idx) =>
    mapOldModuleToBibleschool(m, idx),
  );

  cachedModules = modules;
  cachedLocale = locale;
  return modules;
}

export async function getIntroductionVimeoId(
  locale: SupportedLocale,
): Promise<string> {
  if (cachedLocale === locale && cachedIntroductionVimeoId) {
    return cachedIntroductionVimeoId;
  }
  await getModules(locale);
  return cachedIntroductionVimeoId ?? INTRO_VIDEO_FALLBACK_ID;
}

export async function getModule(
  id: string,
  locale: SupportedLocale,
): Promise<BibleschoolModule | null> {
  const modules =
    cachedModules && cachedLocale === locale
      ? cachedModules
      : await getModules(locale);
  return modules.find((m) => m.id === id) ?? null;
}

export async function getLesson(
  moduleId: string,
  lessonId: string,
  locale: SupportedLocale,
): Promise<BibleschoolLesson | null> {
  const module = await getModule(moduleId, locale);
  if (!module) return null;
  return module.lessons.find((l) => l.id === lessonId) ?? null;
}

export const bibleschoolService = {
  getModules,
  getModule,
  getLesson,
  getIntroductionVimeoId,
};
