import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { getKenyaColor, getBogorColor } from "../legend/Legend";

const CONFIGS = {
  kenya: {
    url: "http://localhost:5000/api/counties",
    center: [0.0, 37.817223],
    zoom: 7,
    name: "Kabupaten Kenya (Kependudukan)",
  },
  bogor: {
    url: "http://localhost:5000/api/fasilitas",
    center: [-6.595, 106.80],
    zoom: 13,
    name: "Fasilitas Publik Kota Bogor (P5)",
  },
};

// Helper component to smoothly pan/zoom map on dataset change
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

const Map = ({ dataset = "kenya" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeConfig = CONFIGS[dataset] || CONFIGS.kenya;

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    fetch(activeConfig.url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json.geojson || json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Failed to load GeoJSON for ${dataset}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [dataset, activeConfig.url]);

  // Kenya polygon style
  const kenyaStyle = (feature) => ({
    fillColor: getKenyaColor(feature.properties?.population),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const highlightKenya = (e) => {
    e.target.setStyle({
      weight: 2,
      color: "#000000",
      fillOpacity: 0.9,
    });
  };

  const resetHighlightKenya = (e) => {
    e.target.setStyle(kenyaStyle(e.target.feature));
  };

  const onEachKenyaFeature = (feature, layer) => {
    const props = feature.properties || {};
    const countyName = props.county || "Unknown County";
    const landArea = props.landarea != null ? Number(props.landarea).toLocaleString() : "-";
    const population = props.population != null ? Number(props.population).toLocaleString() : "-";
    const households = props.households != null ? Number(props.households).toLocaleString() : "-";
    const avHhSize = props.av_hh_size != null ? Number(props.av_hh_size).toLocaleString() : "-";

    layer.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
        <strong style="font-size: 14px; color: #1e293b;">${countyName}</strong><br/>
        <b>Luas Wilayah:</b> ${landArea} SqKm<br/>
        <b>Populasi:</b> ${population}<br/>
        <b>Jumlah KK:</b> ${households}<br/>
        <b>Rata-rata Ukuran KK:</b> ${avHhSize}
      </div>
    `);

    layer.on({
      mouseover: highlightKenya,
      mouseout: resetHighlightKenya,
    });
  };

  // Bogor point style
  const pointToLayerBogor = (feature, latlng) => {
    const jenis = feature.properties?.jenis;
    const color = getBogorColor(jenis);
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: color,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    });
  };

  const onEachBogorFeature = (feature, layer) => {
    const props = feature.properties || {};
    const nama = props.nama || "Tanpa Nama";
    const jenis = props.jenis || "Fasilitas";
    const keterangan = props.keterangan || "-";
    const color = getBogorColor(jenis);

    layer.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 180px;">
        <span style="display:inline-block; font-size: 11px; font-weight: 700; color: #fff; background: ${color}; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
          ${jenis}
        </span><br/>
        <strong style="font-size: 14px; color: #0f172a;">${nama}</strong>
        <p style="margin: 6px 0 0; color: #475569; font-size: 12px;">${keterangan}</p>
      </div>
    `);

    layer.on({
      mouseover: (e) => {
        e.target.setRadius(11);
      },
      mouseout: (e) => {
        e.target.setRadius(8);
      },
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "8px 16px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            fontWeight: "600",
            fontSize: "13px",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
          }}
        >
          Memuat data {activeConfig.name} dari PostgreSQL...
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "#fee2e2",
            color: "#991b1b",
            padding: "8px 16px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            fontWeight: "600",
            fontSize: "13px",
            border: "1px solid #f87171",
          }}
        >
          Gagal memuat data: {error}. Pastikan server backend berjalan pada port 5000.
        </div>
      )}

      <MapContainer
        center={activeConfig.center}
        zoom={activeConfig.zoom}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <MapController center={activeConfig.center} zoom={activeConfig.zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data && dataset === "kenya" && (
          <GeoJSON
            key="kenya-layer"
            data={data}
            style={kenyaStyle}
            onEachFeature={onEachKenyaFeature}
          />
        )}

        {data && dataset === "bogor" && (
          <GeoJSON
            key="bogor-layer"
            data={data}
            pointToLayer={pointToLayerBogor}
            onEachFeature={onEachBogorFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
