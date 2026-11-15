import type { Metadata } from 'next';
import Link from 'next/link';
import { guides } from '@/lib/docs';

export const metadata: Metadata = { title: 'Documentation', description: 'Install, configure and troubleshoot WooFeeds Pro product feeds.' };

export default function DocsPage() {
  return <main id="main"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link> / Documentation</div><span className="eyebrow">Documentation</span><h1>Start with a clean feed.</h1><p>Install WooFeeds Pro, map WooCommerce product fields, validate the catalog and connect each hosted feed URL.</p></div></section><section className="section"><div className="container docs-index"><div className="section-head"><span className="eyebrow">Choose a guide</span><h2>Everything needed to go live.</h2></div><div className="doc-cards">{Object.entries(guides).map(([slug, guide])=><Link className="doc-card" href={`/docs/${slug}`} key={slug}><strong>{guide.title}</strong><span>{guide.description}</span></Link>)}</div><div className="callout"><strong>Quick install:</strong> Download the plugin ZIP, upload it from WordPress → Plugins → Add New Plugin, activate it, then open WooCommerce → WooFeeds Pro.</div></div></section></main>;
}

