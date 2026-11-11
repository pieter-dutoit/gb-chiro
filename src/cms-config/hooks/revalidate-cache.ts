import type { GlobalAfterChangeHook } from 'payload';
import { invalidateContent } from '../lib/revalidate';

const revalidateCache = (_tag: string): GlobalAfterChangeHook => async ({ doc, req }) => {
  void _tag;
  invalidateContent(req.context);
  return doc;
};
export default revalidateCache;
