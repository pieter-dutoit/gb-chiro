import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { invalidateContent } from '../lib/revalidate';

export default function revalidateCollection(_tag: string, _published?: boolean): CollectionAfterChangeHook {
  void _tag; void _published;
  return async ({ doc, req }) => { invalidateContent(req.context); return doc; };
}
export const revalidateCollectionByField = revalidateCollection;
export function revalidateAfterDelete(_options?: { tags?: string[]; fieldNames?: string[] }): CollectionAfterDeleteHook {
  void _options;
  return async ({ doc, req }) => { invalidateContent(req.context); return doc; };
}
