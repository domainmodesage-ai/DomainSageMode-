const fs = require('fs');
const path = require('path');

const domain = 'https://domainsagemode.xyz';
const komikPath = path.join(__dirname, 'data', 'komik.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

function escapeXML(url) {
  return url.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // Hapus karakter non-alphanumeric
    .replace(/\-\-+/g, '-')         // Hapus multiple -
    .replace(/^-+/, '')             // Hapus - di awal
    .replace(/-+$/, '');            // Hapus - di akhir
}

const komikData = JSON.parse(fs.readFileSync(komikPath, 'utf-8'));

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Halaman utama
sitemap += `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

// Halaman statis
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

// Halaman tiap komik (dua versi URL)
komikData.forEach(komik => {
  const seoSlug = slugify(komik.judul || komik.id);

  // URL lama
  sitemap += `
  <url>
    <loc>${escapeXML(`${domain}/komik.html?id=${komik.id}`)}</loc>
    <lastmod>${komik.lastUpdate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `;

  // URL SEO baru
  sitemap += `
  <url>
    <loc>${escapeXML(`${domain}/${seoSlug}`)}</loc>
    <lastmod>${komik.lastUpdate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `;
});

sitemap += `\n</urlset>`;

fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log('✅ Sitemap dengan URL SEO berhasil diperbarui!');
