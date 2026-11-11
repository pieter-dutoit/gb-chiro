import type { CollectionConfig } from 'payload';
import { canEditContent } from '../access/content';
import revalidateCollection, { revalidateAfterDelete } from '../hooks/revalidate-collection';
import { protectMediaChange, protectMediaDelete } from '../lib/media';

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: {
    beforeChange: [protectMediaChange], beforeDelete: [protectMediaDelete],
    afterChange: [revalidateCollection('media')], afterDelete: [revalidateAfterDelete()],
  },
  fields: [{ name: 'alt', type: 'text', label: 'Alternative text', required: true }],
  upload: {
    disableLocalStorage: true,
    // SVG is needed for the existing icons and background graphic. Only images
    // are allowed, only editors can upload, and the frontend never inlines SVG.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'],
    allowRestrictedFileTypes: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [{ name: 'thumbnail', width: 320, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 75 } } }],
  },
};
