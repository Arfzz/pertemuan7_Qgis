import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

const API_URL = "http://localhost:5000/api/counties";

const Map = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
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
        console.error("Failed to load GeoJSON", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  //   choropleth colors
  const getColor = (pop) => {
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

  const style = (feature) => ({
    fillColor: getColor(feature.properties.population),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const highlightFeature = (e) => {
    e.target.setStyle({
      weight: 2,
      color: "#000",
      fillOpacity: 0.9,
    });
  };

  const resetHighlight = (e) => {
    e.target.setStyle(style(e.target.feature));
  };

  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const countyName = props.county || "Unknown County";
    const landArea = props.landarea != null ? Number(props.landarea).toLocaleString() : "-";
    const population = props.population != null ? Number(props.population).toLocaleString() : "-";
    const households = props.households != null ? Number(props.households).toLocaleString() : "-";
    const avHhSize = props.av_hh_size != null ? Number(props.av_hh_size).toLocaleString() : "-";

    layer.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
        <strong style="font-size: 14px; color: #111;">${countyName}</strong><br/>
        <b>Land Area (SqKm):</b> ${landArea}<br/>
        <b>Population:</b> ${population}<br/>
        <b>Households:</b> ${households}<br/>
        <b>Average HH Size:</b> ${avHhSize}
      </div>
    `);

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  const position = [0.0, 37.817223];

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
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Loading county data from PostgreSQL...
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
            background: "#ffebee",
            color: "#c62828",
            padding: "8px 16px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Error loading map data: {error}
        </div>
      )}
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data && (
          <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
};
export default Map;
