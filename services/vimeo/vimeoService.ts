const VIMEO_API_BASE = 'https://api.vimeo.com';

function getToken(): string {
  const token = process.env.EXPO_PUBLIC_VIMEO_ACCESS_TOKEN;
  if (!token) {
    throw new Error('EXPO_PUBLIC_VIMEO_ACCESS_TOKEN is not set');
  }
  return token;
}

interface VimeoProgressiveFile {
  type?: string;
  width?: number;
  height?: number;
  link?: string;
  rendition?: string;
}

interface VimeoPlayResponse {
  play?: {
    progressive?: VimeoProgressiveFile[];
    hls?: { link?: string };
    status?: string;
  };
}

function parseVideoId(raw: string): string {
  const cleaned = String(raw).trim();
  const match = cleaned.match(/(?:vimeo\.com\/(?:video\/)?|^)(\d+)/);
  return match ? match[1] : cleaned.replace(/\D/g, '') || '';
}

export async function getPlaybackUrl(videoId: string): Promise<string | null> {
  const token = getToken();
  const videoIdClean = parseVideoId(videoId);
  if (!videoIdClean) return null;

  if (__DEV__) {
    console.log('[Vimeo] fetching playback URL for videoId:', videoIdClean);
  }
  const res = await fetch(
    `${VIMEO_API_BASE}/videos/${videoIdClean}?fields=play`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    if (__DEV__) console.log('[Vimeo] API error:', res.status, text);
    throw new Error(`Vimeo API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as VimeoPlayResponse;
  if (__DEV__) {
    console.log('[Vimeo] got play.progressive count:', data.play?.progressive?.length ?? 0);
  }
  const progressive = data.play?.progressive ?? [];

  const sorted = [...progressive]
    .filter((p) => p.link)
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const progressiveUrl = sorted[0]?.link ?? null;
  if (progressiveUrl) return progressiveUrl;

  const hlsUrl = data.play?.hls?.link ?? null;
  return hlsUrl;
}

interface VimeoPictureSize {
  width?: number;
  height?: number;
  link?: string;
}

interface VimeoPicturesResponse {
  pictures?: {
    base_link?: string;
    sizes?: VimeoPictureSize[];
  };
}

export async function getThumbnailUrl(videoId: string): Promise<string | null> {
  const token = getToken();
  const videoIdClean = parseVideoId(videoId);
  if (!videoIdClean) return null;

  const res = await fetch(
    `${VIMEO_API_BASE}/videos/${videoIdClean}?fields=pictures.sizes`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
    },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as VimeoPicturesResponse;
  const pictures = data.pictures;
  if (!pictures) return null;

  const sizes = pictures.sizes ?? [];
  const withLink = sizes.filter((s) => s.link && (s.width ?? 0) > 0);
  if (withLink.length > 0) {
    const sorted = [...withLink].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
    const url = sorted[0]?.link ?? null;
    if (url) return url;
  }

  const baseLink = pictures.base_link;
  if (baseLink && /^https?:\/\//.test(baseLink)) return baseLink;

  return null;
}

export const vimeoService = {
  getPlaybackUrl,
  getThumbnailUrl,
};
