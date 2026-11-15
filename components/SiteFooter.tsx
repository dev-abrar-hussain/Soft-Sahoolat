import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer"><div className="container">
      <div className="footer-grid">
        <div><Link className="brand" href="/"><img src="/assets/logo.svg" alt="" /><span>WooFeeds <b>Pro</b></span></Link><p className="muted">Multi-channel WooCommerce product feeds, built by Sahoolat.</p></div>
        <div><h3>Product</h3><Link href="/#features">Features</Link><Link href="/#channels">Channels</Link><Link href="/download">Download</Link></div>
        <div><h3>Resources</h3><Link href="/blog">Blog</Link><Link href="/docs">Documentation</Link><Link href="/docs/troubleshooting">Troubleshooting</Link></div>
        <div><h3>Sahoolat</h3><a href="https://sahoolat.pk/" rel="noopener">Main website</a><Link href="/robots.txt">Robots</Link><Link href="/sitemap.xml">Sitemap</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Sahoolat. All rights reserved.</span><span>WooCommerce is a trademark of its respective owner.</span></div>
    </div></footer>
  );
}
