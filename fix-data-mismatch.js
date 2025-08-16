const fs = require("fs");
const path = require("path");

const mainFile = path.join(__dirname, "data", "komik.json"); // komik.json utama
const komikFolder = path.join(__dirname, "data", "komik");   // folder JSON individual

// baca data utama
let mainData = JSON.parse(fs.readFileSync(mainFile, "utf-8"));

// update tiap item di komik.json
mainData = mainData.map(item => {
  const komikPath = path.join(komikFolder, `${item.id}.json`);

  if (fs.existsSync(komikPath)) {
    const komikDetail = JSON.parse(fs.readFileSync(komikPath, "utf-8"));
    const chapters = komikDetail.chapters || [];
    const totalChapters = chapters.length;
    const latestChapter = totalChapters > 0 ? chapters[chapters.length - 1].judul : `chapter ${totalChapters}`;

    // hanya update jika ada perubahan chapter atau chapter terakhir
    if (item.totalChapters !== totalChapters || item.latestChapter !== latestChapter) {
      item.totalChapters = totalChapters;
      item.latestChapter = latestChapter;
      item.lastUpdate = new Date().toISOString();
    }

  } else {
    console.warn(`⚠️ File tidak ditemukan: ${komikPath}`);
  }

  return item;
});

// simpan ulang komik.json
fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2));
console.log("✅ komik.json berhasil disinkronkan");
