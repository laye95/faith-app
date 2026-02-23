import type { Href } from 'expo-router';

export const routes = {
  main: () => '/(main)' as Href,
  bibleschool: () => '/(main)/bibleschool' as Href,
  bibleschoolIntro: () => '/(main)/bibleschool/intro' as Href,
  bibleschoolModuleLesson: (moduleId: string, lessonId: string): Href =>
    `/(main)/bibleschool/modules/${moduleId}/${lessonId}` as Href,
  bibleschoolModules: () => '/(main)/bibleschool/modules' as Href,
  bibleschoolModule: (moduleId: string): Href =>
    `/(main)/bibleschool/modules/${moduleId}` as Href,
  bibleschoolModuleExam: (moduleId: string): Href =>
    `/(main)/bibleschool/modules/${moduleId}/exam` as Href,
  admin: (path?: string): Href =>
    (path ? `/(main)/admin/${path}` : '/(main)/admin') as Href,
  auth: (screen: 'login' | 'register') => `/(auth)/${screen}` as Href,
  profile: (sub?: 'information' | 'settings'): Href =>
    (sub ? `/(main)/profile/${sub}` : '/(main)/profile') as Href,
  settings: (sub?: 'preferences' | 'video' | 'notifications'): Href =>
    (sub ? `/(main)/settings/${sub}` : '/(main)/settings') as Href,
  podcasts: () => '/(main)/podcasts' as Href,
  sermons: () => '/(main)/sermons' as Href,
  faithBusinessSchool: () => '/(main)/faith-business-school' as Href,
};
