const fs = require('fs');
const path = require('path');

const domain = 'https://domainsagemode.xyz';
const komikPath = path.join(__dirname, 'data', 'komik.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

// Baca file komik.json
const komikData = JSON.parse(fs.readFileSync(komikPath, 'utf-8'));

// Buat sitemap
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

// Halaman lainnya
const staticPages = [
  { loc: `${domain}/cari.html`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${domain}/bookmark&history.html`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${domain}/donasi.html`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${domain}/register.html`, changefreq: 'monthly', priority: '0.5' }
];

staticPages.forEach(page => {
  sitemap += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `;
});

// Halaman tiap komik
komikData.forEach(komik => {
  sitemap += `
  <url>
    <loc>${domain}/komik.html?id=${komik.id}</loc>
    <lastmod>${komik.lastUpdate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `;
});

sitemap += `\n</urlset>`;

// Simpan sitemap.xml
fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log('✅ Sitemap berhasil diperbarui!');