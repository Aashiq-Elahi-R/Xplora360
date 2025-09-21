import React from "react";
import LocalVendorsMap from "./LocalVendorsMap";
import "./App.css";

function App() {
  return (
    <>
      <header>🌍 Local Vendors Finder</header>
      <div className="main">
        <LocalVendorsMap />
      </div>
    </>
  );
}

export default App;
