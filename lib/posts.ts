import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import sanitizeHtml from 'sanitize-html';
import { db } from '@/lib/db';
import type { BlogPost, PostInput } from '@/lib/types';

type PostRow = BlogPost & RowDataPacket;

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 190) || 'post';
}

export function cleanArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'blockquote',
      'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption', 'pre', 'code', 'hr', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      '*': ['style'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^center$/, /^right$/, /^justify$/],
        color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([0-9.,% ]+\)$/i],
        'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([0-9.,% ]+\)$/i],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: 'a',
        attribs: {
          ...attrs,
          ...(attrs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
        },
      }),
      img: (_tag, attrs) => ({
        tagName: 'img',
        attribs: { ...attrs, loading: 'lazy', decoding: 'async' },
      }),
    },
  }).trim();
}

export function plainExcerpt(html: string, length = 180): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
  return text.length <= length ? text : `${text.slice(0, length - 1).trim()}…`;
}

function safeImage(value: string): string {
  const image = value.trim();
  if (image.startsWith('/uploads/blog/')) return image;
  if (/^https:\/\//i.test(image)) return image;
  return '';
}

async function uniqueSlug(requested: string, excludeId = 0): Promise<string> {
  const base = slugify(requested);
  let candidate = base;
  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const [rows] = await db().query<(RowDataPacket & { id: number })[]>(
      'SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1',
      [candidate, excludeId],
    );
    if (!rows.length) return candidate;
    candidate = `${base.slice(0, 180)}-${suffix}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function listPublishedPosts(limit = 9, offset = 0): Promise<BlogPost[]> {
  const [rows] = await db().query<PostRow[]>(
    "SELECT * FROM posts WHERE status = 'published' AND published_at <= NOW() ORDER BY published_at DESC LIMIT ? OFFSET ?",
    [limit, offset],
  );
  return rows;
}

export async function publishedPostCount(): Promise<number> {
  const [rows] = await db().query<(RowDataPacket & { total: number })[]>(
    "SELECT COUNT(*) AS total FROM posts WHERE status = 'published' AND published_at <= NOW()",
  );
  return Number(rows[0]?.total || 0);
}

export async function findPublishedPost(slug: string): Promise<BlogPost | null> {
  const [rows] = await db().query<PostRow[]>(
    "SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at <= NOW() LIMIT 1",
    [slug],
  );
  return rows[0] || null;
}

export async function relatedPosts(postId: number, limit = 3): Promise<BlogPost[]> {
  const [rows] = await db().query<PostRow[]>(
    "SELECT * FROM posts WHERE status = 'published' AND published_at <= NOW() AND id != ? ORDER BY published_at DESC LIMIT ?",
    [postId, limit],
  );
  return rows;
}

export async function listAdminPosts(): Promise<BlogPost[]> {
  const [rows] = await db().query<PostRow[]>('SELECT * FROM posts ORDER BY updated_at DESC');
  return rows;
}

export async function findPost(id: number): Promise<BlogPost | null> {
  const [rows] = await db().query<PostRow[]>('SELECT * FROM posts WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function postCounts(): Promise<{ all: number; published: number; draft: number }> {
  const [rows] = await db().query<(RowDataPacket & { status: string; total: number })[]>(
    'SELECT status, COUNT(*) AS total FROM posts GROUP BY status',
  );
  const counts = { all: 0, published: 0, draft: 0 };
  for (const row of rows) {
    const total = Number(row.total);
    if (row.status === 'published') counts.published = total;
    if (row.status === 'draft') counts.draft = total;
    counts.all += total;
  }
  return counts;
}

export async function savePost(input: PostInput, id = 0): Promise<number> {
  const title = input.title.trim();
  const content = cleanArticleHtml(input.content);
  if (!title || !content) throw new Error('Title and article content are required.');
  const slug = await uniqueSlug(input.slug || title, id);
  const status = input.status === 'published' ? 'published' : 'draft';
  const excerpt = input.excerpt?.trim() || plainExcerpt(content, 220);
  const image = safeImage(input.featured_image || '');
  const seoTitle = input.seo_title?.trim() || title;
  const metaDescription = input.meta_description?.trim() || plainExcerpt(content, 155);
  const publishedAt = status === 'published'
    ? (input.published_at ? new Date(input.published_at).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '))
    : null;

  if (id > 0) {
    await db().execute(
      'UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?, seo_title=?, meta_description=?, status=?, published_at=?, updated_at=NOW() WHERE id=?',
      [title, slug, excerpt, content, image || null, seoTitle, metaDescription, status, publishedAt, id],
    );
    return id;
  }
  const [result] = await db().execute<ResultSetHeader>(
    'INSERT INTO posts (title,slug,excerpt,content,featured_image,seo_title,meta_description,status,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())',
    [title, slug, excerpt, content, image || null, seoTitle, metaDescription, status, publishedAt],
  );
  return result.insertId;
}

export async function deletePost(id: number): Promise<void> {
  await db().execute('DELETE FROM posts WHERE id = ?', [id]);
}

