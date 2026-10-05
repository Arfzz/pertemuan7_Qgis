import React from "react";
import "./selector.css";

const DatasetSelector = ({ selectedDataset, onSelectDataset }) => {
  return (
    <div className="dataset-selector-card" role="region" aria-label="Pemilih Dataset">
      <div className="selector-header">
        <span className="selector-title">Pilih Dataset WebGIS</span>
      </div>
      <div className="selector-buttons">
        <button
          type="button"
          className={`selector-btn ${selectedDataset === "kenya" ? "active" : ""}`}
          onClick={() => onSelectDataset("kenya")}
          aria-pressed={selectedDataset === "kenya"}
        >
          <span className="btn-badge">Polygon</span>
          <span className="btn-label">Kabupaten Kenya (Choropleth)</span>
        </button>

        <button
          type="button"
          className={`selector-btn ${selectedDataset === "bogor" ? "active" : ""}`}
          onClick={() => onSelectDataset("bogor")}
          aria-pressed={selectedDataset === "bogor"}
        >
          <span className="btn-badge btn-badge-bogor">Point</span>
          <span className="btn-label">Fasilitas Publik Bogor (P5)</span>
        </button>
      </div>
    </div>
  );
};

export default DatasetSelector;
