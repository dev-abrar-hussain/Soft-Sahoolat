import Link from 'next/link';

export function PluginBanner() {
  return <aside className="post-plugin-banner" aria-label="WooFeeds Pro download"><div className="post-plugin-mark"><img src="/assets/logo.svg" alt="" /></div><div><strong>Turn this guide into an automated workflow.</strong><span>WooFeeds Pro creates scheduled product feeds for Google, Meta and ChatGPT.</span></div><Link className="button" href="/download">Download plugin</Link></aside>;
}
