import type * as CMS from '@/payload-types';
import type { Article, BusinessDetails, NewPatientStep, Service, SiteMedia, SiteSEO } from './site-types';

export function populated<T extends { id: number }>(value: number | T | null | undefined): value is T {
  return Boolean(value && typeof value === 'object');
}
export function published<T extends { _status?: 'draft' | 'published' | null }>(value: T): boolean {
  return value._status === 'published';
}
export function media(value: number | CMS.Media | CMS.SeoMedia | null | undefined): SiteMedia | undefined {
  if (!populated(value) || !value.filename || !value.url) return undefined;
  const url = new URL(value.url);
  url.searchParams.set("v", value.updatedAt);
  return {
    id: value.id, filename: value.filename, url: url.toString(), alt: value.alt,
    width: value.width ?? undefined, height: value.height ?? undefined,
    mimeType: value.mimeType ?? undefined, createdAt: value.createdAt, updatedAt: value.updatedAt,
  };
}
export function requiredMedia(value: Parameters<typeof media>[0]): SiteMedia {
  const result = media(value);
  if (!result) throw new Error('A published page references missing media. Restore or select the image in Payload.');
  return result;
}
export function article(value: CMS.Article): Article {
  return {
    id: value.id, slug: value.slug || '', title: value.title, author: value.author,
    thumbnail: media(value.thumbnail), body: value.body,
    createdAt: value.createdAt, updatedAt: value.updatedAt,
    description: value.summary ?? undefined, tags: value.keywords?.map(({ value }) => value) ?? undefined,
  };
}
export function service(value: CMS.Service): Service {
  return {
    id: value.id, name: value.name, description: value.description,
    thumbnail: requiredMedia(value.thumbnail),
    article: populated(value.article) && published(value.article) ? article(value.article) : undefined,
    createdAt: value.createdAt, updatedAt: value.updatedAt,
  };
}
export function step(value: CMS.NewPatientStep): NewPatientStep {
  return { ...value, icon: requiredMedia(value.icon) };
}
export function seo(value: CMS.HomePage['seo']): SiteSEO {
  return {
    meta: value.meta,
    openGraph: { siteName: value.open_graph.site_name, title: value.open_graph.title, description: value.open_graph.description,
      image: value.open_graph.image.map(media).filter((image): image is SiteMedia => Boolean(image)) },
  };
}
export function business(value: CMS.BusinessDetail): BusinessDetails {
  return {
    ...value,
    operatingHours: value.operatingHours.map(row => ({ ...row,
      Monday: !!row.Monday, Tuesday: !!row.Tuesday, Wednesday: !!row.Wednesday,
      Thursday: !!row.Thursday, Friday: !!row.Friday, Saturday: !!row.Saturday, Sunday: !!row.Sunday,
    })),
    createdAt: value.createdAt || '', updatedAt: value.updatedAt || '',
  };
}
