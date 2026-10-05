const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

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
        console.log('PostGIS extension enabled!');
      } else {
        console.log('PostGIS extension not found in pg_available_extensions. Using JSONB geometry with ST_AsGeoJSON compatibility function.');
      }
    } catch (e) {
      console.log('Could not enable PostGIS extension, falling back to JSONB mode:', e.message);
    }

    await client.query('DROP TABLE IF EXISTS county_pop CASCADE;');

    if (hasPostGIS) {
      await client.query(`
        CREATE TABLE county_pop (
          id SERIAL PRIMARY KEY,
          county VARCHAR(255),
          county_id INTEGER,
          "total_popu" NUMERIC,
          "male popul" NUMERIC,
          "female pop" NUMERIC,
          households NUMERIC,
          av_hh_size NUMERIC,
          landarea NUMERIC,
          "population" NUMERIC,
          geom GEOMETRY(Geometry, 4326)
        );
      `);
    } else {
      await client.query(`
        CREATE TABLE county_pop (
          id SERIAL PRIMARY KEY,
          county VARCHAR(255),
          county_id INTEGER,
          "total_popu" NUMERIC,
          "male popul" NUMERIC,
          "female pop" NUMERIC,
          households NUMERIC,
          av_hh_size NUMERIC,
          landarea NUMERIC,
          "population" NUMERIC,
          geom JSONB
        );

        CREATE OR REPLACE FUNCTION ST_AsGeoJSON(g JSONB)
        RETURNS text AS $$
        BEGIN
            RETURN g::text;
        END;
        $$ LANGUAGE plpgsql;
      `);
    }

    const geojsonPath = path.join(__dirname, '..', 'frontend', 'public', 'data', 'counties_ready.geojson');
    console.log('Reading GeoJSON data from:', geojsonPath);
    const rawData = fs.readFileSync(geojsonPath, 'utf8');
    const geojsonData = JSON.parse(rawData);

    const features = geojsonData.features || [];
    console.log(`Found ${features.length} features to insert.`);

    for (const f of features) {
      const props = f.properties || {};
      const county = props.County || props.NAME_1 || '';
      const county_id = parseInt(props.county_id || props.ID_1 || '0', 10);
      const total_popu = parseFloat(props.Total_Population19) || 0;
      const male_pop = parseFloat(props['Male populatio 2019']) || 0;
      const female_pop = parseFloat(props['Female population 2019']) || 0;
      const households = parseFloat(props.Households) || 0;
      const av_hh_size = parseFloat(props.Av_HH_Size) || 0;
      const landarea = parseFloat(props.LandArea) || 0;
      const density = parseFloat(props['Population Density']) || 0;
      const geomStr = JSON.stringify(f.geometry);

      if (hasPostGIS) {
        await client.query(
          `INSERT INTO county_pop (county, county_id, "total_popu", "male popul", "female pop", households, av_hh_size, landarea, "population", geom)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_GeomFromGeoJSON($10), 4326));`,
          [county, county_id, total_popu, male_pop, female_pop, households, av_hh_size, landarea, density, geomStr]
        );
      } else {
        await client.query(
          `INSERT INTO county_pop (county, county_id, "total_popu", "male popul", "female pop", households, av_hh_size, landarea, "population", geom)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb);`,
          [county, county_id, total_popu, male_pop, female_pop, households, av_hh_size, landarea, density, geomStr]
        );
      }
    }

    const countRes = await client.query('SELECT count(*) FROM county_pop;');
    console.log(`Successfully imported ${countRes.rows[0].count} counties into county_pop table!`);
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
