# Web GIS Full Stack (React Leaflet + PostgreSQL + PostGIS)

Aplikasi Web GIS Full Stack interaktif dengan fitur **pemilihan dataset dinamis** (*Dataset Selector*), dibangun menggunakan **React Leaflet**, **Express (Node.js)**, dan **PostgreSQL / PostGIS**.

Project ini menggabungkan materi praktikum mata kuliah **Sistem Informasi Geografis**:
1. **Dataset 1 (Pertemuan 7):** Peta tematik (*Choropleth Map*) kependudukan Kabupaten Kenya (Poligon).
2. **Dataset 2 (Pertemuan 5):** Peta sebaran Fasilitas Publik Kota Bogor (Titik/Point) yang telah dimigrasikan ke database PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Leaflet, Leaflet, CSS3
- **Backend:** Node.js, Express.js, `pg` (PostgreSQL Client), CORS, Dotenv
- **Database:** PostgreSQL + PostGIS (Spatial Data Engine)
- **Datasets:**
  - `counties_ready.geojson`: Data Sensus Kenya 2019 (47 Kabupaten)
  - `fasilitas.geojson`: Data Fasilitas Publik Kota Bogor (57 Titik Fasilitas)

---

## 📁 Struktur Folder

```
├── backend/
│   ├── routes/
│   │   ├── counties.js       # Route API /api/counties (Kabupaten Kenya)
│   │   └── fasilitas.js      # Route API /api/fasilitas (Fasilitas Bogor)
│   ├── db.js                 # Koneksi PostgreSQL Pool
│   ├── import_data.js        # Script import data Kenya ke PostgreSQL
│   ├── import_fasilitas.js   # Script import data Bogor ke PostgreSQL
│   ├── server.js             # Entrypoint server Express (Port 5000)
│   ├── .env.example          # Template konfigurasi environment
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── data/
│   │       ├── counties_ready.geojson  # GeoJSON Kenya
│   │       └── fasilitas.geojson       # GeoJSON Bogor
│   ├── src/
│   │   ├── map/
│   │   │   └── Map.jsx       # Komponen Peta Leaflet & dual rendering
│   │   ├── legend/
│   │   │   ├── Legend.jsx    # Komponen Legenda dinamis (Kenya & Bogor)
│   │   │   └── legend.css
│   │   ├── selector/
│   │   │   ├── DatasetSelector.jsx  # Kontrol pemilih dataset mengambang
│   │   │   └── selector.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── start-all.bat             # Runner otomatis Backend & Frontend (1-Click)
├── start-backend.bat         # Runner Backend
└── start-frontend.bat        # Runner Frontend
```

---

## 🚀 Cara Menjalankan Project

### 1. Prasyarat
- **Node.js** (v18+) & **npm**
- **PostgreSQL** (Port 5432 aktif)

### 2. Konfigurasi Database & Impor Data
1. Buat database `kenya_db` di PostgreSQL (atau sesuaikan di `.env`).
2. Di folder `backend`, salin file `.env.example` menjadi `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=kenya_db
   DB_PORT=5432
   PORT=5000
   ```
3. Jalankan script impor data ke PostgreSQL:
   ```bash
   # Impor data kependudukan Kenya (Pertemuan 7)
   node backend/import_data.js

   # Impor data fasilitas publik Bogor (Pertemuan 5)
   node backend/import_fasilitas.js
   ```

### 3. Menjalankan Server

#### Cara Praktis (Windows):
Cukup jalankan file `start-all.bat` dengan cara double-click.

#### Cara Manual:
- **Terminal 1 (Backend):**
  ```bash
  cd backend
  npm start
  ```
  *Berjalan di: `http://localhost:5000`*
  - Endpoint Kenya: `http://localhost:5000/api/counties`
  - Endpoint Bogor: `http://localhost:5000/api/fasilitas`

- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm start
  ```
  *Berjalan di: `http://localhost:3000`*

---

## 🗺️ Fitur Utama Aplikasi

1. **Pemilih Dataset (Dataset Selector):**
   - Berada di pojok kanan atas peta, memungkinkan pengguna berganti data dalam 1 klik.
   - Peta otomatis melakukan transisi halus (*flyTo*) ke pusat wilayah yang dipilih.
2. **Mode Kenya (Pertemuan 7):**
   - Visualisasi poligon Choropleth berdasarkan interval populasi (7 gradasi warna).
   - Hover highlight garis batas wilayah dan popup informasi detail kabupaten.
   - Legenda skala interval populasi.
3. **Mode Kota Bogor (Pertemuan 5):**
   - Visualisasi titik (*CircleMarker*) fasilitas publik Kota Bogor.
   - Warna titik dibedakan otomatis berdasarkan kategori (*Pendidikan, Kesehatan, Transportasi, Ruang Publik, Pemerintahan, dll.*).
   - Popup interaktif menampilkan nama, kategori, dan deskripsi fasilitas.
   - Legenda kategori fasilitas publik.
