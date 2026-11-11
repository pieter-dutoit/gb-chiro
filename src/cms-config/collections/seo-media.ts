import type { CollectionConfig } from 'payload';
import { canEditContent } from '../access/content';
import revalidateCollection, { revalidateAfterDelete } from '../hooks/revalidate-collection';
import { protectMediaChange, protectMediaDelete } from '../lib/media';

export const SEOMedia: CollectionConfig = {
  slug: 'seo-media',
  labels: { singular: 'SEO Media', plural: 'SEO Media' },
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { beforeChange: [protectMediaChange], beforeDelete: [protectMediaDelete], afterChange: [revalidateCollection('seo-media')], afterDelete: [revalidateAfterDelete()] },
  fields: [{ name: 'alt', type: 'text', label: 'Brief image description', required: true }],
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    formatOptions: { format: 'jpeg', options: { quality: 75 } },
    resizeOptions: { width: 1200, height: 630, fit: 'cover', position: 'center' },
    adminThumbnail: 'thumbnail',
    imageSizes: [{ name: 'thumbnail', width: 600, height: 315, fit: 'cover', formatOptions: { format: 'jpeg', options: { quality: 75 } } }],
  },
};
