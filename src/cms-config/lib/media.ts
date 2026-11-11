import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook } from 'payload';
import { storagePrefix } from './environment';

function assertOwned(prefix?: string | null) {
  const own = storagePrefix();
  if (!prefix || !(prefix === own || prefix.startsWith(`${own}/`))) {
    throw new Error('This file belongs to another environment. Upload a new copy here instead.');
  }
}

export const protectMediaChange: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (operation === 'update') assertOwned(originalDoc?.prefix);
  return data;
};
export const protectMediaDelete: CollectionBeforeDeleteHook = async ({ id, req, collection }) => {
  const doc = await req.payload.findByID({ collection: collection.slug, id, req, depth: 0 });
  assertOwned((doc as { prefix?: string }).prefix);
};
