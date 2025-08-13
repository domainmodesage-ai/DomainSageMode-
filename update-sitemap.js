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
    "bookmark.html",
    "history.html"
  ];
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}/${page}`,
      lastmod: new Date().toISOString(),
      priority: 1.0
    });
  });

  // Halaman detail komik + chapter
  komikData.forEach(komik => {
    // Halaman detail komik
    urls.push({
      loc: `${baseUrl}/komik.html?id=${komik.id}`,
      lastmod: komik.lastUpdate || new Date().toISOString(),
      priority: 0.9
    });

    // Halaman setiap chapter
    komik.chapter.forEach((chap, index) => {
      urls.push({
        loc: `${baseUrl}/baca.html?komik_id=${komik.id}&chapter=${index}`,
        lastmod: komik.lastUpdate || new Date().toISOString(),
        priority: 0.8
      });
    });
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
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  fs.writeFileSync(sitemapPath, xml.trim());
  console.log("✅ sitemap.xml berhasil dibuat!");
}

generateSitemap();
