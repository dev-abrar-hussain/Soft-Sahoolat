# Soft Sahoolat

Production website and blog CMS for WooFeeds Pro, live at [soft.sahoolat.pk](https://soft.sahoolat.pk/).

## Stack

- Next.js 16 App Router and React 19
- MySQL with server-side route handlers
- TipTap rich editor with toolbar, selection bubble menu, tables, images and formatting
- Signed HTTP-only admin sessions, bcrypt passwords, origin checks and login throttling
- Dynamic SEO metadata, article schema, sitemap and robots rules

## Local development

Copy `.env.example` to `.env.local`, provide the MySQL URL and a 32+ character session secret, then run `npm install` and `npm run dev`.

Use `npm test` and `npm run build` for validation. The admin is at `/admin/login`. Uploaded images are written to `UPLOAD_DIR`; production maps that directory to `/uploads/blog/` through Nginx.

## Production

Next.js standalone output runs as a systemd service on `127.0.0.1:3105`. Nginx terminates TLS and proxies requests. Versioned releases live under `/var/www/soft.sahoolat.pk/releases/`, while blog uploads remain in the shared directory.
