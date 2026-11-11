import type { SiteMedia, MediaSize } from '../site-types';

export function createMediaUrl(media: SiteMedia | null | undefined): string {
  return media?.url || '';
}
// Retained for metadata consumers; responsive sizes now come from Next Image.
export function getMediaVariants(media: SiteMedia | null | undefined | false): MediaSize[] {
  return media ? [{ filename: media.filename, url: media.url, width: media.width, height: media.height }] : [];
}
export function createMediaSizeUrl(media: SiteMedia | null | undefined | false, _size: string): string {
  void _size;
  return media ? createMediaUrl(media) : '';
}
