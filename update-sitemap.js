const fs = require("fs");
const path = require("path");

const baseUrl = "https://domainsagemode.xyz";
const komikPath = path.join(__dirname, "data", "komik.json");
const sitemapPath = path.join(__dirname, "sitemap.xml");

function generateSitemap() {
  const komikData = JSON.parse(fs.readFileSync(komikPath, "utf-8"));

  const urls = [];

  // Halaman statis
  const staticPages = [
    "",
    "index.html",
    "cari.html",
    "bookmark-history.html",
    "donasi.html",
    "register.html",
    "chat.html"
  ];
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0
    });
  });

  // Halaman detail komik + chapter
  komikData.forEach(komik => {
    // Halaman detail komik
    urls.push({
      loc: `${baseUrl}/komik.html?id=${komik.id}`,
      lastmod: komik.lastUpdate || new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8
    });

    // Halaman setiap chapter (loop pakai totalChapter)
    for (let i = 0; i < (komik.totalChapter || 0); i++) {
      urls.push({
        loc: `${baseUrl}/baca.html?id=${komik.id}&ch=${i}`,
        lastmod: komik.lastUpdate || new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      });
    }
  });

  // Buat XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  fs.writeFileSync(sitemapPath, xml.trim());
  console.log("✅ sitemap.xml berhasil dibuat!");
}

generateSitemap();
