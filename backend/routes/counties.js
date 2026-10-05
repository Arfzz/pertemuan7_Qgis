const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const query = `
            SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(
              jsonb_build_object(
                'type', 'Feature', 
                'geometry', ST_AsGeoJSON(geom)::jsonb, 
                'properties', jsonb_build_object(
                    'county',"county",
                    'county_id', "county_id",
                    'population',"total_popu",
                    'male_population', "male popul",
                    'female_population', "female pop",
                    'households', "households",
                    'av_hh_size', "av_hh_size",
                    'landarea', "landarea",
                    'density', "population"
                )
            )
        )
    ) AS geojson
    FROM county_pop;
`;

    const { rows } = await pool.query(query);
    res.json(rows[0].geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
