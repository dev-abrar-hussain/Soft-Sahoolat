import Link from 'next/link';
import type { BlogPost } from '@/lib/types';

export function formatDate(value: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Karachi' }).format(new Date(value.replace(' ', 'T') + '+05:00'));
}

export function BlogCard({ post }: { post: BlogPost }) {
  return <article className="blog-card">{post.featured_image && <Link className="blog-card-image" href={`/blog/${post.slug}`}><img src={post.featured_image} alt="" loading="lazy" /></Link>}<div className="blog-card-body"><span className="blog-card-date">{formatDate(post.published_at)}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="text-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">→</span></Link></div></article>;
}
