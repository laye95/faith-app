const CDN_BASE = 'https://api.storyblok.com/v2/cdn';

function getToken(): string {
  const token = process.env.EXPO_PUBLIC_STORYBLOK_ACCESS_TOKEN;
  if (!token) {
    throw new Error('EXPO_PUBLIC_STORYBLOK_ACCESS_TOKEN is not set');
  }
  return token;
}

function truncateResponseBody(text: string, max = 400): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export class StoryblokApiError extends Error {
  readonly status: number;
  readonly operation: 'fetchStories' | 'fetchStory';
  readonly path?: string;
  readonly responseBodyPreview?: string;

  constructor(
    message: string,
    init: {
      status: number;
      operation: 'fetchStories' | 'fetchStory';
      path?: string;
      responseBodyPreview?: string;
    },
  ) {
    super(message);
    this.name = 'StoryblokApiError';
    this.status = init.status;
    this.operation = init.operation;
    this.path = init.path;
    this.responseBodyPreview = init.responseBodyPreview;
    Object.setPrototypeOf(this, new.target.prototype);
  }
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
    throw new StoryblokApiError(`Storyblok CDN request failed (${res.status})`, {
      status: res.status,
      operation: 'fetchStories',
      responseBodyPreview: truncateResponseBody(text),
    });
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
    throw new StoryblokApiError(`Storyblok CDN request failed (${res.status})`, {
      status: res.status,
      operation: 'fetchStory',
      path: normalizedPath,
      responseBodyPreview: truncateResponseBody(text),
    });
  }

  return res.json() as Promise<{ story: StoryblokStoryObject<T> }>;
}
