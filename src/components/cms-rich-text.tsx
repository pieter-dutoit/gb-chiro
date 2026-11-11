import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical';
import { media } from '@/lib/cms-mappers';
import MediaImage from './media-image';
import { Typography } from './ui/typography';

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h2';
    return <Typography as={tag} variant={`article${tag.toUpperCase()}` as 'articleH2'}>{nodesToJSX({ nodes: node.children })}</Typography>;
  },
  paragraph: ({ node, nodesToJSX }) => <Typography as="p" variant="articleParagraph">{nodesToJSX({ nodes: node.children })}</Typography>,
  list: ({ node, nodesToJSX }) => node.tag === 'ol'
    ? <ol start={node.start} className="list-decimal flex flex-col gap-2 pl-6 text-base leading-6 md:leading-7 mb-5 [&>li]:pl-1">{nodesToJSX({ nodes: node.children })}</ol>
    : <ul className="list-disc flex flex-col gap-2 pl-6 text-base leading-6 md:leading-7 mb-5 [&>li]:pl-1">{nodesToJSX({ nodes: node.children })}</ul>,
  upload: ({ node }) => {
    if (node.relationTo !== 'media' && node.relationTo !== 'seo-media') return null;
    if (typeof node.value !== "object") return null;
    const image = media(node.value);
    if (!image) return null;
    return <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-primary/10 shadow-md my-8">
      <MediaImage media={image} sizes="(min-width: 660px) 576px, 90vw" className="object-cover object-center blur-xl scale-125" />
      <MediaImage media={image} sizes="(min-width: 660px) 576px, 90vw" className="object-contain object-center" />
    </div>;
  },
});
export default function CMSRichText({ data, className, article = false }: { data: SerializedEditorState; className?: string; article?: boolean }) {
  return <RichText data={data} converters={article ? converters : undefined} className={className} />;
}
