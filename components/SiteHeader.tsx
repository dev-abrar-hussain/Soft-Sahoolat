'use client';

import Link from 'next/link';
import { useState } from 'react';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="WooFeeds Pro home"><img src="/assets/logo.svg" alt="" /><span>WooFeeds <b>Pro</b></span></Link>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation"><Link href="/#features">Features</Link><Link href="/#channels">Channels</Link><Link href="/blog">Blog</Link><Link href="/docs">Documentation</Link><Link className="button small" href="/download">Get WooFeeds Pro</Link></nav>
      </div>
    </header>
  );
}
