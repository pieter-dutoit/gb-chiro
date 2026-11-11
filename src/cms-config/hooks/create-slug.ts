import type { CollectionBeforeChangeHook } from 'payload';

export const slugify = (value: string) => value.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
const createSlug: CollectionBeforeChangeHook = ({ data, originalDoc, context }) => ({
  ...data,
  slug: context.importing && data.slug ? data.slug : slugify(data.title ?? originalDoc?.title ?? ''),
});
export default createSlug;
