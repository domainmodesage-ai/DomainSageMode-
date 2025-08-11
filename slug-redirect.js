// slug-redirect.js
const params = new URLSearchParams(window.location.search);
const path = window.location.pathname.replace(/^\/+|\/+$/g, ''); // hapus / di awal & akhir

// Kalau URL bentuknya /slug-biasa
if (path && !path.includes('.') && !path.startsWith('komik.html')) {
    fetch('/data/komik.json')
        .then(res => res.json())
        .then(komikList => {
            const slugify = text => text.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            const found = komikList.find(k => slugify(k.title) === path);
            if (found) {
                window.location.href = `/komik.html?id=${found.id}`;
            } else {
                window.location.href = '/'; // kalau tidak ketemu
            }
        });
}
