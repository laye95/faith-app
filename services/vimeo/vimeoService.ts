const VIMEO_API_BASE = 'https://api.vimeo.com';

const COMBINED_FIELDS = 'play,pictures.sizes,duration';

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

interface VimeoCombinedApiResponse extends VimeoPlayResponse, VimeoPicturesResponse {
  duration?: number;
}

function parseVideoId(raw: string): string {
  const cleaned = String(raw).trim();
  const match = cleaned.match(/(?:vimeo\.com\/(?:video\/)?|^)(\d+)/);
  return match ? match[1] : cleaned.replace(/\D/g, '') || '';
}

const MIN_ACCEPTABLE_WIDTH = 480;
const DEFAULT_TARGET_WIDTH = 1280;

export interface GetPlaybackUrlOptions {
  maxWidth?: number;
  preferHls?: boolean;
}

export interface VimeoVideoMetaRaw {
  play?: VimeoPlayResponse['play'];
  pictures?: VimeoPicturesResponse['pictures'];
  durationSeconds: number | null;
}

export function pickPlaybackUrlFromPlay(
  play: VimeoPlayResponse['play'] | undefined,
  options?: GetPlaybackUrlOptions,
): string | null {
  const progressive = play?.progressive ?? [];
  const hlsUrl = play?.hls?.link ?? null;

  if (options?.preferHls && hlsUrl) return hlsUrl;

  const targetWidth = options?.maxWidth ?? DEFAULT_TARGET_WIDTH;
  const withLinks = progressive.filter((p) => p.link);
  const acceptable = withLinks.filter((p) => (p.width ?? 0) >= MIN_ACCEPTABLE_WIDTH);
  const candidates = acceptable.length > 0 ? acceptable : withLinks;
  const withinLimit =
    options?.maxWidth != null
      ? candidates.filter((p) => (p.width ?? 0) <= options!.maxWidth!)
      : candidates;
  const pool = withinLimit.length > 0 ? withinLimit : candidates;
  const sorted = [...pool].sort((a, b) => {
    const aw = a.width ?? 0;
    const bw = b.width ?? 0;
    const aDist = Math.abs(aw - targetWidth);
    const bDist = Math.abs(bw - targetWidth);
    return aDist - bDist;
  });
  const progressiveUrl = sorted[0]?.link ?? null;
  if (progressiveUrl) return progressiveUrl;

  return hlsUrl;
}

export function pickThumbnailUrlFromPictures(
  pictures: VimeoPicturesResponse['pictures'] | undefined,
): string | null {
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

export async function getVimeoVideoMetaRaw(videoId: string): Promise<VimeoVideoMetaRaw> {
  const token = getToken();
  const videoIdClean = parseVideoId(videoId);
  if (!videoIdClean) {
    return { durationSeconds: null };
  }

  const res = await fetch(
    `${VIMEO_API_BASE}/videos/${videoIdClean}?fields=${COMBINED_FIELDS}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vimeo API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as VimeoCombinedApiResponse;
  return {
    play: data.play,
    pictures: data.pictures,
    durationSeconds: data.duration ?? null,
  };
}

export async function getVideoMeta(
  videoId: string,
  options?: GetPlaybackUrlOptions,
): Promise<{
  playbackUrl: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
}> {
  const raw = await getVimeoVideoMetaRaw(videoId);
  return {
    playbackUrl: pickPlaybackUrlFromPlay(raw.play, options),
    thumbnailUrl: pickThumbnailUrlFromPictures(raw.pictures),
    durationSeconds: raw.durationSeconds,
  };
}

export async function getPlaybackUrl(
  videoId: string,
  options?: GetPlaybackUrlOptions,
): Promise<string | null> {
  const raw = await getVimeoVideoMetaRaw(videoId);
  return pickPlaybackUrlFromPlay(raw.play, options);
}

export async function getThumbnailUrl(videoId: string): Promise<string | null> {
  const raw = await getVimeoVideoMetaRaw(videoId);
  return pickThumbnailUrlFromPictures(raw.pictures);
}

export async function getDuration(videoId: string): Promise<number | null> {
  const raw = await getVimeoVideoMetaRaw(videoId);
  return raw.durationSeconds;
}

export const vimeoService = {
  getPlaybackUrl,
  getThumbnailUrl,
  getDuration,
  getVimeoVideoMetaRaw,
  getVideoMeta,
};
