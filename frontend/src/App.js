import React, { useState } from "react";
import "./App.css";
import Map from "./map/Map";
import Legend from "./legend/Legend";
import DatasetSelector from "./selector/DatasetSelector";

function App() {
  const [dataset, setDataset] = useState("kenya");

  return (
    <div className="App">
      <DatasetSelector
        selectedDataset={dataset}
        onSelectDataset={setDataset}
      />
      <Map dataset={dataset} />
      <Legend dataset={dataset} />
    </div>
  );
}

export default App;
