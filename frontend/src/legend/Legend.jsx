import React from "react";
import "../legend/legend.css";

const KENYA_GRADES = [0, 50000, 100000, 200000, 500000, 1000000, 2000000];

export const getKenyaColor = (pop) => {
  return pop > 2000000
    ? "#800026"
    : pop > 1000000
    ? "#BD0026"
    : pop > 500000
    ? "#E31A1C"
    : pop > 200000
    ? "#FC4E2A"
    : pop > 100000
    ? "#FD8D3C"
    : pop > 50000
    ? "#FEB24C"
    : "#FFEDA0";
};

export const BOGOR_CATEGORIES = [
  { name: "Pendidikan", color: "#2563eb" },
  { name: "Kesehatan", color: "#dc2626" },
  { name: "Transportasi", color: "#d97706" },
  { name: "Pemerintahan", color: "#7c3aed" },
  { name: "Ruang publik", color: "#059669" },
  { name: "Tempat ibadah", color: "#0891b2" },
  { name: "Fasilitas olahraga", color: "#ea580c" },
];

export const getBogorColor = (jenis) => {
  const found = BOGOR_CATEGORIES.find(
    (c) => c.name.toLowerCase() === (jenis || "").toLowerCase()
  );
  return found ? found.color : "#64748b";
};

const Legend = ({ dataset = "kenya" }) => {
  if (dataset === "bogor") {
    return (
      <div className="map-legend" role="region" aria-label="Legenda Fasilitas Bogor">
        <h4>Kategori Fasilitas (Bogor)</h4>
        {BOGOR_CATEGORIES.map((cat, i) => (
          <div key={i} className="legend-item">
            <span
              className="legend-color legend-color-circle"
              style={{ backgroundColor: cat.color }}
            ></span>
            <span className="legend-label">{cat.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="map-legend" role="region" aria-label="Legenda Populasi Kenya">
      <h4>Populasi Kabupaten (Kenya)</h4>
      {KENYA_GRADES.map((g, i) => (
        <div key={i} className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: getKenyaColor(g + 1) }}
          ></span>
          <span className="legend-label">
            {g.toLocaleString()}
            {KENYA_GRADES[i + 1] ? ` - ${KENYA_GRADES[i + 1].toLocaleString()}` : "+"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
