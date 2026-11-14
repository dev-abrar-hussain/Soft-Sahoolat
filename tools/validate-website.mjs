import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const htmlFiles = [];
const errors = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  }
}

await walk(root);
const canonicals = new Set();

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const relative = path.relative(root, file);
  if (!/<html[^>]+lang="en"/i.test(html)) errors.push(`${relative}: missing html language`);
  if (!/<meta[^>]+name="viewport"/i.test(html)) errors.push(`${relative}: missing viewport`);
  if (!/<title>[^<]{8,}<\/title>/i.test(html)) errors.push(`${relative}: missing useful title`);

  if (relative !== '404.html') {
    if (!/<meta[^>]+name="description"[^>]+content="[^"]{40,}"/i.test(html)) errors.push(`${relative}: missing useful meta description`);
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
    if (!canonical) errors.push(`${relative}: missing canonical URL`);
    else if (canonicals.has(canonical)) errors.push(`${relative}: duplicate canonical ${canonical}`);
    else canonicals.add(canonical);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gi)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(reference)) continue;
    const clean = reference.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target = clean.startsWith('/') ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    if (clean.endsWith('/')) target = path.join(target, 'index.html');
    try { await fs.access(target); } catch { errors.push(`${relative}: broken internal reference ${reference}`); }
  }
}

const zipName = 'woofeeds-pro-0.1.0.zip';
const websiteZip = await fs.readFile(path.join(root, 'downloads', zipName));
const checksumFile = await fs.readFile(path.join(root, 'downloads', 'SHA256SUMS'), 'utf8');
const expectedDigest = checksumFile.match(new RegExp(`^([a-f0-9]{64})\\s+${zipName.replaceAll('.', '\\.')}$`, 'mi'))?.[1];
const actualDigest = crypto.createHash('sha256').update(websiteZip).digest('hex');
if (!expectedDigest || actualDigest !== expectedDigest) errors.push('Public plugin ZIP does not match downloads/SHA256SUMS.');

const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const canonical of canonicals) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`Canonical missing from sitemap: ${canonical}`);
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, ${canonicals.size} canonical URLs and the public release checksum.`);
