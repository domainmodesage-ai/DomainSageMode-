const fs = require("fs");
const path = require("path");

const baseUrl = "https://domainsagemode.xyz";
const outputFile = "sitemap.xml";

function getAllHtmlFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith(".html")) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(".");
const today = new Date().toISOString().split("T")[0];

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

htmlFiles.forEach(file => {
  const relativePath = file.replace(/^\.\//, "").replace(/\\/g, "/");
  const url = `${baseUrl}/${relativePath}`;
  
  sitemapContent += `  <url>\n`;
  sitemapContent += `    <loc>${url}</loc>\n`;
  sitemapContent += `    <lastmod>${today}</lastmod>\n`;
  sitemapContent += `  </url>\n`;
});

sitemapContent += `</urlset>\n`;

fs.writeFileSync(outputFile, sitemapContent, "utf8");

console.log(`✅ Sitemap generated with ${htmlFiles.length} URLs.`);
