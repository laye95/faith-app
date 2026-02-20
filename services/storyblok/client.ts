const CDN_BASE = 'https://api.storyblok.com/v2/cdn';

function getToken(): string {
  const token = process.env.EXPO_PUBLIC_STORYBLOK_ACCESS_TOKEN;
  if (!token) {
    throw new Error('EXPO_PUBLIC_STORYBLOK_ACCESS_TOKEN is not set');
  }
  return token;
}

interface FetchOptions {
  version?: 'draft' | 'published';
  language?: string;
  starts_with?: string;
  by_slugs?: string;
}

export interface StoryblokStoryObject<T = Record<string, unknown>> {
  uuid: string;
  id: number;
  slug: string;
  full_slug: string;
  content: T;
  position?: number;
  lang?: string;
}

export async function fetchStories<T = Record<string, unknown>>(
  options: FetchOptions = {},
): Promise<{ stories: StoryblokStoryObject<T>[] }> {
  const query = new URLSearchParams();
  query.set('token', getToken());
  query.set('version', options.version ?? 'published');
  if (options.language) query.set('language', options.language);
  if (options.starts_with) query.set('starts_with', options.starts_with);
  if (options.by_slugs) query.set('by_slugs', options.by_slugs);

  const url = `${CDN_BASE}/stories?${query.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storyblok API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<{ stories: StoryblokStoryObject<T>[] }>;
}

export async function fetchStory<T = Record<string, unknown>>(
  path: string,
  options: Omit<FetchOptions, 'starts_with' | 'by_slugs'> = {},
): Promise<{ story: StoryblokStoryObject<T> }> {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const query = new URLSearchParams();
  query.set('token', getToken());
  query.set('version', options.version ?? 'published');
  if (options.language) query.set('language', options.language);

  const url = `${CDN_BASE}/stories/${normalizedPath}?${query.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storyblok API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<{ story: StoryblokStoryObject<T> }>;
}
