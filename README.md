# Web GIS Choropleth Map (React Leaflet + PostgreSQL + PostGIS)

Aplikasi Web GIS Full Stack interaktif untuk visualisasi peta tematik (*Choropleth Map*) demografi kependudukan Kabupaten Kenya, dibangun menggunakan **React Leaflet**, **Express (Node.js)**, dan **PostgreSQL / PostGIS**.

Project ini disusun untuk keperluan praktikum mata kuliah **Sistem Informasi Geografis (Pertemuan 7)**.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Leaflet, Leaflet, CSS3
- **Backend:** Node.js, Express.js, `pg` (PostgreSQL Client), CORS, Dotenv
- **Database:** PostgreSQL + PostGIS (Spatial Data Engine)
- **Dataset:** Data Sensus Kenya 2019 (47 Kabupaten) dalam format spasial GeoJSON `FeatureCollection`

---

## 📁 Struktur Folder

```
├── backend/
│   ├── routes/
│   │   └── counties.js       # Route API /api/counties (Query ST_AsGeoJSON)
│   ├── db.js                 # Koneksi PostgreSQL Pool
│   ├── import_data.js        # Script otomatis import data GeoJSON ke PostgreSQL
│   ├── server.js             # Entrypoint server Express (Port 5000)
│   ├── .env.example          # Template konfigurasi environment
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── counties_ready.geojson  # Data spasial & atribut 47 kabupaten
│   ├── src/
│   │   ├── map/
│   │   │   └── Map.jsx       # Komponen Peta Leaflet & styling Choropleth
│   │   ├── legend/
│   │   │   ├── Legend.jsx    # Komponen Legenda interval populasi
│   │   │   └── legend.css
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
3. Jalankan script migrasi/impor data spasial:
   ```bash
   node backend/import_data.js
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

- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm start
  ```
  *Berjalan di: `http://localhost:3000`*

---

## 🗺️ Fitur Aplikasi
- **Peta Interaktif:** Navigasi pan & zoom menggunakan base map OpenStreetMap.
- **Visualisasi Choropleth:** Pewarnaan 7 gradasi warna berdasarkan rentang jumlah populasi tiap kabupaten.
- **Hover Highlight:** Efek penonjolan garis batas poligon dan transparansi saat kursor diarahkan ke suatu wilayah.
- **Informasi Popup:** Menampilkan nama kabupaten, luas wilayah ($Km^2$), total populasi, jumlah rumah tangga, dan rata-rata ukuran rumah tangga saat kabupaten diklik.
- **Legenda Peta:** Skala referensi interval data populasi di bagian kiri bawah peta.
