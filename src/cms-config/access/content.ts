import type { Access } from 'payload';

export const canEditContent: Access = ({ req: { user } }) =>
  Boolean(user?.roles?.some((role: string) => role === 'admin' || role === 'editor'));

export const publishedOrEditor: Access = (args) =>
  canEditContent(args) ? true : { _status: { equals: 'published' } };

export const contentAccess = {
  read: publishedOrEditor,
  create: canEditContent,
  update: canEditContent,
  delete: canEditContent,
};
