const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'kenya_db',
  port: process.env.DB_PORT || 5432,
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to database:', process.env.DB_NAME || 'kenya_db');

    let hasPostGIS = false;
    try {
      const extCheck = await client.query("SELECT name FROM pg_available_extensions WHERE name = 'postgis';");
      if (extCheck.rows.length > 0) {
        await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        hasPostGIS = true;
        console.log('PostGIS extension available.');
      } else {
        console.log('PostGIS extension not found in pg_available_extensions. Using JSONB geometry.');
      }
    } catch (e) {
      console.log('PostGIS check warning:', e.message);
    }

    await client.query('DROP TABLE IF EXISTS fasilitas_bogor CASCADE;');

    if (hasPostGIS) {
      await client.query(`
        CREATE TABLE fasilitas_bogor (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255),
          jenis VARCHAR(100),
          keterangan TEXT,
          geom GEOMETRY(Point, 4326)
        );
      `);
    } else {
      await client.query(`
        CREATE TABLE fasilitas_bogor (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255),
          jenis VARCHAR(100),
          keterangan TEXT,
          geom JSONB
        );
      `);
    }

    let geojsonPath = path.join(__dirname, '..', 'frontend', 'public', 'data', 'fasilitas.geojson');
    if (!fs.existsSync(geojsonPath)) {
      geojsonPath = path.resolve(__dirname, '..', '..', 'Pertemuan 5', 'PraktikumLeaflet', 'data', 'fasilitas.geojson');
    }

    console.log('Reading fasilitas data from:', geojsonPath);
    const rawData = fs.readFileSync(geojsonPath, 'utf8');
    const geojsonData = JSON.parse(rawData);

    const features = geojsonData.features || [];
    console.log(`Found ${features.length} features to insert.`);

    for (const f of features) {
      const props = f.properties || {};
      const nama = props.nama || 'Tanpa Nama';
      const jenis = props.jenis || 'Lainnya';
      const keterangan = props.keterangan || '';
      const geomStr = JSON.stringify(f.geometry);

      if (hasPostGIS) {
        await client.query(
          `INSERT INTO fasilitas_bogor (nama, jenis, keterangan, geom)
           VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326));`,
          [nama, jenis, keterangan, geomStr]
        );
      } else {
        await client.query(
          `INSERT INTO fasilitas_bogor (nama, jenis, keterangan, geom)
           VALUES ($1, $2, $3, $4::jsonb);`,
          [nama, jenis, keterangan, geomStr]
        );
      }
    }

    const countRes = await client.query('SELECT count(*) FROM fasilitas_bogor;');
    console.log(`Successfully imported ${countRes.rows[0].count} fasilitas into fasilitas_bogor table!`);
  } catch (err) {
    console.error('Error importing fasilitas:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
