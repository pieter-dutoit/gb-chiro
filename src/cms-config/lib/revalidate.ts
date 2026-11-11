import { revalidatePath, revalidateTag } from 'next/cache';
import type { RequestContext } from 'payload';

export function invalidateContent(context: RequestContext) {
  if (context.skipRevalidation) return;
  // This small site shares business details, navigation, media and relationships
  // across every page. Invalidate the public cache together to avoid omissions.
  revalidateTag('payload-public', { expire: 0 });
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}
