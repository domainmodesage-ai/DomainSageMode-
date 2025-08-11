const fs = require('fs');
const path = require('path');

const domain = 'https://domainsagemode.xyz';
const komikPath = path.join(__dirname, 'data', 'komik.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

function escapeXML(url) {
  return url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // hapus simbol
    .replace(/\s+/g, '-')         // spasi jadi -
    .replace(/-+/g, '-');         // hapus -- ganda
}

const komikData = JSON.parse(fs.readFileSync(komikPath, 'utf-8'));

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

sitemap += `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

const staticPages = [
  { loc: `${domain}/cari.html`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${domain}/bookmark-history.html`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${domain}/donasi.html`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${domain}/register.html`, changefreq: 'monthly', priority: '0.5' }
];

staticPages.forEach(page => {
  sitemap += `
  <url>
    <loc>${escapeXML(page.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `;
});

komikData.forEach(komik => {
  const slug = slugify(komik.title);

  // Versi lama
  sitemap += `
  <url>
    <loc>${escapeXML(`${domain}/komik.html?id=${komik.id}`)}</loc>
    <lastmod>${komik.lastUpdate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `;

  // Versi slug SEO
  sitemap += `
  <url>
    <loc>${escapeXML(`${domain}/${slug}`)}</loc>
    <lastmod>${komik.lastUpdate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `;
});

sitemap += `\n</urlset>`;

fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log('✅ Sitemap berhasil diperbarui!');
