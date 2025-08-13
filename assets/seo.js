function setMetaTag(name, content, property = false) {
  let meta;
  if (property) {
    meta = document.querySelector(`meta[property="${name}"]`);
  } else {
    meta = document.querySelector(`meta[name="${name}"]`);
  }

  if (!meta) {
    meta = document.createElement("meta");
    if (property) meta.setAttribute("property", name);
    else meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setJSONLD(data) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

function setDynamicSEO(komik, chapter = null) {
  const baseUrl = "https://domainsagemode.xyz/";

  if (komik) {
    const title = chapter 
      ? `${komik.judul} - ${chapter.judul} | Domain Sage Mode`
      : `${komik.judul} | Domain Sage Mode`;
    const description = chapter
      ? `Baca ${komik.judul} ${chapter.judul} dalam bahasa Indonesia, update cepat hanya di Domain Sage Mode.`
      : `Baca ${komik.judul} bahasa Indonesia, update terbaru hanya di Domain Sage Mode.`;

    document.title = title;
    setMetaTag("description", description);
    setMetaTag("keywords", `${komik.judul}, baca komik, manga, manhwa, bahasa Indonesia`);
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", komik.cover || `${baseUrl}assets/logo.png`, true);
    setMetaTag("og:url", chapter 
      ? `${baseUrl}baca.html?id=${komik.id}&ch=${komik.chapter.indexOf(chapter)}`
      : `${baseUrl}komik.html?id=${komik.id}`, true);
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", komik.cover || `${baseUrl}assets/logo.png`);

    setCanonical(chapter 
      ? `${baseUrl}baca.html?id=${komik.id}&ch=${komik.chapter.indexOf(chapter)}`
      : `${baseUrl}komik.html?id=${komik.id}`
    );

    setJSONLD({
      "@context": "https://schema.org",
      "@type": chapter ? "Chapter" : "ComicSeries",
      "name": komik.judul,
      "description": description,
      "url": chapter 
        ? `${baseUrl}baca.html?id=${komik.id}&ch=${komik.chapter.indexOf(chapter)}`
        : `${baseUrl}komik.html?id=${komik.id}`,
      "image": komik.cover || `${baseUrl}assets/logo.png`,
      "author": komik.author || "Tidak diketahui"
    });
  }
}

function setPageSEO({ title, description, url }) {
  const baseUrl = "https://domainsagemode.xyz/";

  document.title = title;
  setMetaTag("description", description);
  setMetaTag("og:title", title, true);
  setMetaTag("og:description", description, true);
  setMetaTag("og:image", `${baseUrl}assets/logo.png`, true);
  setMetaTag("og:url", url, true);
  setMetaTag("twitter:title", title);
  setMetaTag("twitter:description", description);
  setMetaTag("twitter:image", `${baseUrl}assets/logo.png`);
  setCanonical(url);

  setJSONLD({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url
  });
}


function setChapterSEO(komik, chapter) {
  if (typeof setDynamicSEO === "function") {
    setDynamicSEO(komik, chapter);
  }
}
// Deteksi halaman otomatis
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/" || path === "/index.html") {
    setPageSEO({
      title: "Domain Sage Mode - Baca Komik Bahasa Indonesia Terbaru",
      description: "Baca komik bahasa Indonesia terbaru, update cepat, gratis, dan mudah diakses hanya di Domain Sage Mode.",
      url: "https://domainsagemode.xyz/"
    });
  } 
  else if (path.endsWith("cari.html")) {
    setPageSEO({
      title: "Cari Komik - Domain Sage Mode",
      description: "Cari komik bahasa Indonesia terbaru di Domain Sage Mode dengan cepat dan mudah.",
      url: "https://domainsagemode.xyz/cari.html"
    });
  }
  else if (path.endsWith("bookmark-history.html")) {
    setPageSEO({
      title: "Bookmark - History - Domain Sage Mode",
      description: "Lihat daftar komik yang sudah kamu bookmark dan riwayat bacaanmu di Domain Sage Mode.",
      url: "https://domainsagemode.xyz/bookmark-history.html"
    });
  }
});
