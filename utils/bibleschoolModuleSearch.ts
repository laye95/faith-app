import type { BibleschoolModule } from '@/types/bibleschool';

export function filterBibleschoolModulesBySearch(
  modules: BibleschoolModule[],
  searchQuery: string,
): BibleschoolModule[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return modules;
  return modules
    .map((mod) => ({
      ...mod,
      lessons: (mod.lessons ?? []).filter((l) =>
        (l.title ?? '').toLowerCase().includes(q),
      ),
    }))
    .filter(
      (mod) =>
        mod.title.toLowerCase().includes(q) ||
        (mod.description ?? '').toLowerCase().includes(q) ||
        mod.lessons.length > 0,
    );
}
