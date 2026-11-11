import fs from 'node:fs';
import path from 'node:path';
import * as seed from '../../src/lib/site-data';
import { mediaVariants } from '../../src/lib/media-variants';
import type { SiteMedia } from '../../src/lib/seed-types';
import type { Article } from '../../src/payload-types';
type SerializedEditorState = Article['body'];

export { seed };
const text = (value: string, format = 0) => ({ type: 'text', text: value, format, mode: 'normal', style: '', detail: 0, version: 1 });
const block = (type: string, children: unknown[], extra = {}) => ({ type, children, format: '', indent: 0, direction: 'ltr', version: 1, ...extra });
export function paragraphs(values: string[], ordinals = false): SerializedEditorState {
  const nodes = values.map(value => {
    const match = ordinals && value.match(/^(\d+)(st|nd|rd|th)(.*)$/);
    return block('paragraph', match ? [text(match[1]), text(match[2], 64), text(match[3])] : [text(value)]);
  });
  return { root: block('root', nodes) } as SerializedEditorState;
}

export function articleBody(imageID: number): SerializedEditorState {
  const mdx = fs.readFileSync('src/content/articles/neck-and-back-pain-relief.mdx', 'utf8');
  const content = mdx.replace(/^import .*;\n/gm, '').replace(/<div\b[\s\S]*?<\/div>/, '\n\n[ARTICLE_IMAGE]\n\n').trim();
  const children = content.split(/\n\s*\n/).map(section => {
    if (section === '[ARTICLE_IMAGE]') return { type: 'upload', relationTo: 'media', value: imageID, fields: null, format: '', version: 3 };
    if (/^## /.test(section)) return block('heading', [text(section.slice(3))], { tag: 'h2' });
    if (/^(?:- |\d+\. )/.test(section)) {
      const ordered = /^\d/.test(section);
      return block('list', section.split('\n').map((line, i) => block('listitem', [text(line.replace(/^(?:- |\d+\. )/, ''))], { value: i + 1 })), { tag: ordered ? 'ol' : 'ul', listType: ordered ? 'number' : 'bullet', start: 1 });
    }
    if (/[<>]/.test(section)) throw new Error('Unsupported MDX markup in article seed');
    return block('paragraph', [text(section.replace(/\n/g, ' '))]);
  });
  return { root: block('root', children) } as SerializedEditorState;
}

export function sourceFile(image: SiteMedia, seo = false): string {
  const archive = 'cms-export/image-source-archive/full';
  const original = path.join(archive, image.filename);
  if (seo) {
    const publicPath = path.join('public/images/seo', image.filename);
    if (fs.existsSync(publicPath)) return publicPath;
    const archivedSEO = path.join(archive, 'seo', image.filename);
    if (fs.existsSync(archivedSEO)) return archivedSEO;
  }
  if (image.filename.endsWith('.svg')) {
    const publicPath = path.join('public/images', image.filename);
    if (fs.existsSync(publicPath)) return publicPath;
  }
  const variants = (mediaVariants[image.filename] ?? []).filter(v => fs.existsSync(path.join('public/images', v.filename))).sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  // Large photos: reuse 1920px sources. Cards and logos need more resolution
  // than their deployed 384–480px copies for high-density screens.
  if ((variants[0]?.width ?? 0) >= 1600) return path.join('public/images', variants[0].filename);
  if (fs.existsSync(original)) return original;
  if (variants[0]) return path.join('public/images', variants[0].filename);
  throw new Error(`Missing source image: ${image.filename}`);
}

// Read only whitelisted INSERT records. Never execute the SQL dump, including
// its accounts, password hashes, session records or historical revisions.
export function exportedImages(): { collection: 'media' | 'seo-media'; image: SiteMedia }[] {
  const dump = 'cms-export/payload-data.sql';
  if (!fs.existsSync(dump)) return [];
  const result: ReturnType<typeof exportedImages> = [];
  for (const line of fs.readFileSync(dump, 'utf8').split('\n')) {
    const match = line.match(/^INSERT INTO payload\.(media|seo_media) \(([^)]+)\) VALUES \((.*)\);$/);
    if (!match) continue;
    const values: (string | number | null)[] = [];
    const tokens = match[3].match(/'(?:[^']|'')*'|[^,]+/g) ?? [];
    for (const raw of tokens) {
      const value = raw.trim();
      values.push(value.startsWith("'") ? value.slice(1, -1).replace(/''/g, "'") : value === 'NULL' ? null : Number(value));
    }
    const columns = match[2].split(', ');
    if (values.length !== columns.length) throw new Error(`Cannot parse ${match[1]} export`);
    const row = Object.fromEntries(columns.map((name, index) => [name, values[index]]));
    result.push({ collection: match[1] === 'media' ? 'media' : 'seo-media', image: {
      id: Number(row.id), filename: String(row.filename), alt: String(row.alt || ''),
      width: Number(row.width), height: Number(row.height), mimeType: String(row.mime_type),
    } });
  }
  return result;
}
