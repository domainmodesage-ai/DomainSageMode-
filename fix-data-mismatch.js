const fs = require("fs");
const path = require("path");

const mainFile = path.join(__dirname, "data", "komik.json"); // komik.json utama
const komikFolder = path.join(__dirname, "data", "komik");   // folder JSON individual

// baca data utama
let mainData = JSON.parse(fs.readFileSync(mainFile, "utf-8"));

// buat Map cepat untuk cek id
const mainMap = new Map(mainData.map(item => [item.id, item]));

// baca semua file JSON di folder komik
const files = fs.readdirSync(komikFolder).filter(f => f.endsWith(".json"));

files.forEach(file => {
  const komikPath = path.join(komikFolder, file);
  const komikDetail = JSON.parse(fs.readFileSync(komikPath, "utf-8"));
  const chapters = komikDetail.chapters || [];
  const totalChapters = chapters.length;
  const latestChapter = totalChapters > 0 ? chapters[chapters.length - 1].judul : `chapter ${totalChapters}`;
  const id = path.basename(file, ".json");

  if (mainMap.has(id)) {
    // komik sudah ada di komik.json
    const item = mainMap.get(id);
    if (item.totalChapters !== totalChapters || item.latestChapter !== latestChapter) {
      item.totalChapters = totalChapters;
      item.latestChapter = latestChapter;
      item.lastUpdate = new Date().toISOString();
    }
  } else {
    // komik baru, tambahkan ke mainData
    const newItem = {
      id,
      judul: komikDetail.judul || id,
      format: komikDetail.format || "Unknown",
      genre: komikDetail.genre || [],
      cover: komikDetail.cover || "",
      lastUpdate: new Date().toISOString(),
      rating: { total: 0, count: 0 },
      latestChapter,
      totalChapters
    };
    mainData.push(newItem);
    mainMap.set(id, newItem);
    console.log(`➕ Komik baru ditambahkan: ${id}`);
  }
});

// simpan ulang komik.json
fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2));
console.log("✅ komik.json berhasil disinkronkan");
