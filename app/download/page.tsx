import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Download WooFeeds Pro', description: 'Download WooFeeds Pro v0.1.0 for WordPress and WooCommerce.' };

export default function DownloadPage() {
  return <main id="main"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link> / Download</div><span className="eyebrow">Current release</span><h1>Download WooFeeds Pro.</h1><p>Install the plugin from WordPress, map product data and generate your first channel-ready feed.</p></div></section><section className="section"><div className="container"><article className="download-card"><div><span className="eyebrow">Version 0.1.0</span><h2>WooFeeds Pro for WordPress</h2><p className="muted">Google Merchant XML, Meta Commerce XML, ChatGPT JSONL.gz, scheduling, mapping, validation and domain-locked licensing.</p><div className="download-meta"><span>Released November 2026</span><span>ZIP package</span><span>License activation required</span></div></div><div className="download-actions"><a className="button" href="/downloads/woofeeds-pro-0.1.0.zip" download>Download ZIP ↓</a></div></article><div className="requirements"><div className="requirement"><strong>WordPress</strong><span>6.4 or newer</span></div><div className="requirement"><strong>WooCommerce</strong><span>8.0 or newer</span></div><div className="requirement"><strong>PHP</strong><span>7.4 or newer</span></div><div className="requirement"><strong>Extension</strong><span>zlib for gzip</span></div></div><div className="callout info"><strong>SHA-256:</strong> <code>b99e195ebdc3869b7c81ad70348ffc5627658e2b7d1202f3ed3d2591ccec7be4</code></div></div></section></main>;
}

