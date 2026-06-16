# Deskripsi Singkat Proyek

Proyek ini adalah Frontend BookVerse yang dibuat menggunakan React dan Vite. Aplikasi ini berfungsi sebagai antarmuka pengguna untuk mengakses seluruh fitur yang tersedia pada sistem BookVerse, termasuk rekomendasi buku, analisis emosi, dan fitur personalisasi lainnya.

# Pentunjuk Setup Environment

Pastikan telah melakukan instalasi Node.js versi 18 atau yang lebih baru sebelum menjalankan aplikasi.

# Konfigurasi Backend

Buka file berikut:

```text
src/lib/config.js
```

Sesuaikan nilai `BASE_URL` dengan URL Backend yang digunakan.

```javascript
import axios from "axios";

const BASE_URL = "https://panel-bookverse.kendah.my.id/api";

axios.defaults.baseURL = BASE_URL;
```

Apabila menggunakan Backend lokal, ubah menjadi:

```javascript
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

axios.defaults.baseURL = BASE_URL;
```

# Konfigurasi Storage

Buka file berikut:

```text
src/lib/helper.js
```

Sesuaikan nilai `BASE_STORAGE_URL` dengan URL storage Backend yang digunakan.

```javascript
const BASE_STORAGE_URL = "https://panel-bookverse.kendah.my.id/storage";

export function buildStorageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) return url;

  if (url.includes('/storage')) {
    return `https://panel-bookverse.kendah.my.id/${url}`;
  }

  const cleanUrl = url.replace(/^\/storage/, '');
  return `${BASE_STORAGE_URL}/${cleanUrl}`;
}
```

Apabila menggunakan Backend lokal, ubah menjadi:

```javascript
const BASE_STORAGE_URL = "http://localhost:8000/storage";

export function buildStorageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) return url;

  if (url.includes('/storage')) {
    return `http://localhost:8000/${url}`;
  }

  const cleanUrl = url.replace(/^\/storage/, '');
  return `${BASE_STORAGE_URL}/${cleanUrl}`;
}
```

# Cara Menjalankan aplikasi

1. Pastikan sudah terinstal Node.js versi 18 atau yang lebih baru.

2. Jalankan NPM untuk menginstal seluruh dependensi:

```bash
npm install
```

3. Jalankan aplikasi:

```bash
npm run dev
```

4. Setelah aplikasi berhasil dijalankan, frontend dapat diakses melalui:

```text
http://localhost:5173
```
