# Soft Sahoolat

Source for the WooFeeds Pro product website at
[soft.sahoolat.pk](https://soft.sahoolat.pk/).

The site is intentionally static: it has no runtime dependencies, is quick to
serve through Nginx, and includes the public product documentation and current
plugin download.

## Included

- WooFeeds Pro marketing and feature pages
- Google Merchant, Meta Commerce, and ChatGPT setup documentation
- Licensing and troubleshooting guides
- SEO metadata, structured data, `robots.txt`, and `sitemap.xml`
- Direct WooFeeds Pro release download with a published SHA-256 checksum
- Nginx deployment configuration

## Validate locally

Node.js 20 or newer is recommended.

```bash
npm test
```

To preview the site from this directory:

```bash
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Production deployment

Production uses versioned releases below
`/var/www/soft.sahoolat.pk/releases/`. The active release is selected through
the `/var/www/soft.sahoolat.pk/current` symlink, which makes rollback a single
symlink update.

The initial Nginx virtual host is in
[`deploy/nginx-soft.sahoolat.pk.conf`](deploy/nginx-soft.sahoolat.pk.conf).
After DNS points to the server, Certbot can attach the certificate and enable
the HTTP-to-HTTPS redirect:

```bash
certbot --nginx -d soft.sahoolat.pk --redirect
```

