const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(geom)::jsonb,
              'properties', jsonb_build_object(
                'id', id,
                'nama', nama,
                'jenis', jenis,
                'keterangan', keterangan
              )
            )
          ),
          '[]'::jsonb
        )
      ) AS geojson
      FROM fasilitas_bogor;
    `;

    const { rows } = await pool.query(query);
    res.json(rows[0].geojson);
  } catch (err) {
    console.error("Error fetching fasilitas:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
