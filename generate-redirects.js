const fs = require('fs');
const path = require('path');

const komikData = JSON.parse(fs.readFileSync('data/komik.json', 'utf8'));

// Fungsi ubah judul jadi slug
function slugify(text) {
  return text
    .toString()
    .normalize("NFD") // Hilangkan aksen
    .replace(/[\u0300-\u036f]/g, "") // Hapus tanda aksen
    .replace(/\s+/g, '-') // Spasi → -
    .replace(/[^\w\-]+/g, '') // Hapus karakter non-alfanumerik
    .replace(/\-\-+/g, '-') // Hapus --
    .replace(/^-+/, '') // Hapus - di awal
    .replace(/-+$/, '') // Hapus - di akhir
    .toLowerCase();
}

komikData.forEach(komik => {
  const slug = slugify(komik.judul);
  const folderPath = path.join('komik', slug);

  fs.mkdirSync(folderPath, { recursive: true });

  const redirectHTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=/komik.html?id=${encodeURIComponent(komik.id)}">
<title>${komik.judul}</title>
</head>
<body>
Jika tidak terarah otomatis, klik <a href="/komik.html?id=${encodeURIComponent(komik.id)}">di sini</a>.
</body>
</html>`;

  fs.writeFileSync(path.join(folderPath, 'index.html'), redirectHTML, 'utf8');
});

console.log("✅ Semua folder redirect sudah dibuat!");
