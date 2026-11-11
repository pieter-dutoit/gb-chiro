import Image, { type ImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';
import type { SiteMedia } from '@/lib/site-types';

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'fill'> & {
  media: SiteMedia | null | undefined | false;
};
export default function MediaImage({ media, sizes, className, priority, ...props }: Props) {
  if (!media || !media.url) return null;
  return <Image {...props} src={media.url} alt={media.alt} fill
    sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
    preload={priority} unoptimized={media.mimeType === 'image/svg+xml' || media.filename.endsWith('.svg')}
    className={twMerge('absolute inset-0 size-full object-contain', className)} />;
}
