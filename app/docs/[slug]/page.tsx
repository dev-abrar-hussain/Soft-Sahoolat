import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/docs';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return Object.keys(guides).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = guides[(await params).slug];
  return guide ? { title: guide.title, description: guide.description } : {};
}

export default async function DocGuidePage({ params }: PageProps) {
  const slug = (await params).slug;
  const guide = guides[slug];
  if (!guide) notFound();
  return <main id="main"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/docs">Documentation</Link> / Guide</div><span className="eyebrow">WooFeeds Pro guide</span><h1>{guide.title}</h1><p>{guide.description}</p></div></section><div className="container docs-layout"><aside className="docs-nav"><strong>Documentation</strong><Link href="/docs">Getting started</Link>{Object.entries(guides).map(([itemSlug,item])=><Link href={`/docs/${itemSlug}`} aria-current={itemSlug === slug ? 'page' : undefined} key={itemSlug}>{item.title.replace(' setup','').replace('WooFeeds Pro','')}</Link>)}</aside><article className="docs-content">{guide.sections.map((section)=><section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.steps && <ol>{section.steps.map((step)=><li key={step}>{step}</li>)}</ol>}</section>)}<div className="callout"><strong>Need the plugin?</strong> <Link href="/download">Download WooFeeds Pro v0.1.0</Link> and follow this guide from the WordPress dashboard.</div></article></div></main>;
}

