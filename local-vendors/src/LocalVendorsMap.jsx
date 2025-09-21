import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Papa from "papaparse";

// Fix Leaflet marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LocalVendorsMap() {
  const [position, setPosition] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [category, setCategory] = useState("All");
  const [filteredVendors, setFilteredVendors] = useState([]);

  // Load CSV on mount
  useEffect(() => {
    Papa.parse("/Local_Vendors.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Normalize keys and convert lat/lon to numbers
        const cleaned = results.data.map((v) => ({
          state: v["State"],
          city: v["City"],
          location: v["Location"],
          vendor_type: v["Vendor_type"],
          traditional_speciality: v["Traditional_Speciality"],
          contact_info: v["Contact_Info"],
          operating_hours: v["Operating_hours"],
          latitude: parseFloat(v["Latitude"]),
          longitude: parseFloat(v["Longitude"]),
        }));
        setVendors(cleaned);
      },
      error: (err) => console.error("CSV parse error:", err),
    });
  }, []);

  // Categories from dataset
  const categories = ["All", ...new Set(vendors.map((v) => v.vendor_type))];

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => alert("Please enable location access!")
    );
  }, []);

  // Filter vendors based on category
  useEffect(() => {
    if (category === "All") setFilteredVendors(vendors);
    else
      setFilteredVendors(
        vendors.filter((v) => v.vendor_type === category)
      );
  }, [category, vendors]);

  // Voice assistant
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          backgroundColor: "#f2f2f2",
          overflowY: "auto",
        }}
      >
        <h2>Local Vendors</h2>

        <label>Select Category: </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", marginTop: "10px", padding: "5px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "20px" }}>
          {filteredVendors.length === 0 && <p>No vendors found.</p>}
          {filteredVendors.map((v, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fff",
                borderRadius: "5px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              <strong>{v.location}</strong>
              <br />
              Type: {v.vendor_type}
              <br />
              Specialty: {v.traditional_speciality}
              <br />
              Contact: {v.contact_info}
              <br />
              Hours: {v.operating_hours}
              <br />
              <button
                style={{ marginRight: "5px", marginTop: "5px" }}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${v.latitude},${v.longitude}`,
                    "_blank"
                  )
                }
              >
                Go
              </button>
              <button
                style={{ marginTop: "5px" }}
                onClick={() =>
                  speak(
                    `${v.location}, ${v.vendor_type}, specialty: ${v.traditional_speciality}`
                  )
                }
              >
                Speak
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        {position && (
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
            {filteredVendors
              .filter((v) => !isNaN(v.latitude) && !isNaN(v.longitude))
              .map((v, idx) => (
                <Marker key={idx} position={[v.latitude, v.longitude]}>
                  <Popup>
                    <b>{v.location}</b>
                    <br />
                    Type: {v.vendor_type}
                    <br />
                    Specialty: {v.traditional_speciality}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
