const fs = require("fs");
const path = require("path");

const BASE_URL = "https://domainsagemode.xyz";
const OUTPUT_FILE = "sitemap.xml";

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath.replace(/\\/g, "/"));
    }
  });

  return arrayOfFiles;
}

function generateSitemap() {
  const allFiles = getAllFiles(".")
    .filter(file => !file.includes("node_modules"))
    .filter(file => !file.startsWith("./.git"))
    .filter(file => !file.startsWith("./.github"))
    .filter(file => !file.includes("update-sitemap.js")) // biar gak masuk
    .filter(file =>
      /\.(html|png|jpg|jpeg|webp|js|css)$/i.test(file) // file yang mau dimasukkan
    );

  let urls = allFiles.map(file => {
    let relativePath = file.replace("./", "");
    return `${BASE_URL}/${relativePath}`;
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(url => {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  fs.writeFileSync(OUTPUT_FILE, sitemapContent, "utf8");
  console.log(`✅ Sitemap generated: ${OUTPUT_FILE}`);
}

generateSitemap();
