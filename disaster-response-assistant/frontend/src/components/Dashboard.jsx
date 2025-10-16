// frontend/src/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";
import L from "leaflet";

import "antd/dist/reset.css";
import "leaflet/dist/leaflet.css";
import "../styles/Dashboard.css";

import HelpModal from "./Modal/HelpModal";
import SucFailModal from "./Modal/SucFailModal";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure Leaflet marker icons to use correct image URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// SVG pin icon for city markers and risk cards
const PinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    style={{ verticalAlign: "middle" }}
  >
    <g>
      <circle
        cx="10"
        cy="9"
        r="2.5"
        stroke="#2563eb"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M10 18C10 18 16 12.5 16 8.5C16 5.46 13.54 3 10.5 3C7.46 3 5 5.46 5 8.5C5 12.5 10 18 10 18Z"
        stroke="#2563eb"
        strokeWidth="2"
        fill="none"
      />
    </g>
  </svg>
);

// List of hazard types for selection
const hazardTypes = [
  "Earthquake-Induced Landslide",
  "Flood",
  "Ground Shaking",
  "Liquefaction",
  "Rain-Induced Landslide",
  "Storm Surge",
  "Tsunami",
];

// List of NCR cities/municipalities for selection
const citiesMunicipality = [
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Manila",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Paranaque",
  "Pasay",
  "Pasig",
  "Pateros",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
];

/**
 * LiveWeatherChip
 * Fetches and displays current weather for Metro Manila.
 */
function LiveWeatherChip() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=8841301dadfb4f5ca53131724250210&q=Metro Manila`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <span className="nav-chip">Loading weather...</span>;
  if (!weather || weather.error)
    return <span className="nav-chip">Weather unavailable</span>;

  const { current } = weather;
  return (
    <>
      <span className="nav-chip">🌡️ {current.temp_c}°C</span>
      <span className="nav-chip">💧 {current.precip_mm} mm</span>
      <span className="nav-chip">💨 {current.wind_kph} kph</span>
      <span
        className={`nav-chip${
          current.condition.text.toLowerCase().includes("rain") ? " severe" : ""
        }`}
      >
        {current.condition.icon && (
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            style={{ width: 20, verticalAlign: "middle", marginRight: 4 }}
          />
        )}
        {current.condition.text}
      </span>
    </>
  );
}

// Risk level configuration for color and text
const riskLevelConfig = {
  high: { color: "#ef4444", text: "HIGH" },
  medium: { color: "#f59e0b", text: "MEDIUM" },
  low: { color: "#22c55e", text: "LOW" },
};

/**
 * RiskAssessmentCard
 * Displays risk info for a city and hazard.
 */
function RiskAssessmentCard({ hazard, city, hazardLevel, recommendation }) {
  const riskLevel = hazardLevel?.toLowerCase();
  const config = riskLevelConfig[riskLevel] || {
    color: "#888",
    text: "UNKNOWN",
  };
  return (
    <div className="risk-card">
      <div className="risk-card-header">
        <span className="risk-area-icon-name">
          <PinIcon />
          <span className="risk-city-name">{city}</span>
        </span>
      </div>
      <div className="risk-hazard-row">
        <span className="risk-hazard-label">Hazard Type:</span>
        <span className="risk-hazard-value">{hazard}</span>
        <span className="risk-level-pill-container">
          <span
            className="risk-level-label"
            style={{ marginRight: "7px", fontWeight: 500, color: "#2563eb" }}
          >
            Level:
          </span>
          <span className={`risk-pill ${riskLevel}`}>{config.text}</span>
        </span>
      </div>
      <p className="risk-desc">{recommendation}</p>
    </div>
  );
}

/**
 * RiskLegend
 * Shows/hides the legend for risk levels.
 */
function RiskLegend({ minimized, onMinimize, onRestore }) {
  if (minimized) {
    return (
      <div className="legend-chip" onClick={onRestore} title="Show Legend">
        Legend
      </div>
    );
  }
  return (
    <div className="risk-legend">
      <button
        className="legend-minimize-btn"
        onClick={onMinimize}
        title="Minimize"
      >
        &minus;
      </button>
      <h4>Risk Level Legend</h4>
      <div className="legend-item">
        <span
          className="dot high"
          style={{ background: riskLevelConfig.high.color }}
        ></span>
        <span className="legend-label">High</span>
      </div>
      <div className="legend-item">
        <span
          className="dot medium"
          style={{ background: riskLevelConfig.medium.color }}
        ></span>
        <span className="legend-label">Medium</span>
      </div>
      <div className="legend-item">
        <span
          className="dot low"
          style={{ background: riskLevelConfig.low.color }}
        ></span>
        <span className="legend-label">Low</span>
      </div>
    </div>
  );
}

/**
 * NCRMap
 * Renders a Leaflet map with NCR city risk circles based on selected hazard.
 */
function NCRMap({ selectedHazard, mapData }) {
  const NCR_CENTER = [14.6091, 121.0223];
  return (
    <MapContainer
      center={NCR_CENTER}
      zoom={11.5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapData.map((city) => {
        const hazardLevel = city[selectedHazard]?.toLowerCase() || "low";
        const color = riskLevelConfig[hazardLevel]?.color || "#888";
        const radius =
          hazardLevel === "high"
            ? 2000
            : hazardLevel === "medium"
            ? 1500
            : 1000;
        return (
          <Circle
            key={city.NCR || city.city || city.name}
            center={[parseFloat(city.lat), parseFloat(city.lon)]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <b>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  <PinIcon />
                  {city.NCR || city.city || city.name}
                </span>
              </b>
              <br />
              Hazard: <b>{selectedHazard}</b>
              <br />
              Level: <b>{city[selectedHazard]}</b>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
}

/**
 * ExportButton
 * Selects export format and triggers export.
 */
const ExportButton = ({ onClick, disabled, format, setFormat }) => (
  <div>
    <Select
      value={format}
      onChange={setFormat}
      style={{ width: "100%", marginBottom: 8 }}
      className={
        format === "pdf"
          ? "export-select export-type-pdf"
          : "export-select export-type-excel"
      }
    >
      <Select.Option value="pdf" className="export-type-pdf">
        PDF
      </Select.Option>
      <Select.Option value="excel" className="export-type-excel">
        Excel
      </Select.Option>
    </Select>
    <button className="export-btn" onClick={onClick} disabled={disabled}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        style={{ marginRight: 8, verticalAlign: "middle" }}
      >
        <path
          d="M10 3V13M10 13L6 9M10 13L14 9M4 17H16"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Export Report ({format === "pdf" ? "PDF" : "Excel"})
    </button>
  </div>
);

/**
 * Dashboard
 * Main component for disaster dashboard.
 * Handles filters, map, risk assessment, export, and help modal.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedHazard, setSelectedHazard] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [legendMinimized, setLegendMinimized] = useState(false);

  const [showHelp, setShowHelp] = useState(false);

  // Modal state for export success/fail feedback
  const [exportModal, setExportModal] = useState({
    visible: false,
    success: true,
    message: "",
  });

  // Fetch risk data whenever filters change
  useEffect(() => {
    setLoading(true);
    const cityParam = selectedCities.length
      ? `city=${selectedCities.join(",")}`
      : "";
    const hazardParam = selectedHazard
      ? `hazard=${encodeURIComponent(selectedHazard)}`
      : "";
    const url = `http://127.0.0.1:5000/api/risk-data?${cityParam}${
      hazardParam ? `&${hazardParam}` : ""
    }`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRiskData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCities, selectedHazard]);

  /**
   * handleExport
   * Validates filters, fetches export file, triggers download, and shows feedback modal.
   */
  async function handleExport() {
    // Validation before export
    if (!selectedHazard || !selectedCities.length) {
      setExportModal({
        visible: true,
        success: false,
        message:
          "Please select at least one city and a hazard type before exporting.",
      });
      return;
    }

    const endpoint =
      exportFormat === "excel"
        ? "http://127.0.0.1:5000/api/export_excel"
        : "http://127.0.0.1:5000/api/export_pdf";
    const url = `${endpoint}?city=${selectedCities.join(
      ","
    )}&hazard=${encodeURIComponent(selectedHazard)}`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Failed to export report.");

      const blob = await response.blob();
      let fileExtension = exportFormat === "excel" ? "xlsx" : "pdf";
      const fileName = `Risk_Report_${selectedCities.join(
        "_"
      )}_${selectedHazard}.${fileExtension}`;
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Show success modal
      setExportModal({
        visible: true,
        success: true,
        message: "Report exported successfully!",
      });
      setTimeout(
        () => setExportModal((modal) => ({ ...modal, visible: false })),
        2000
      );
    } catch (error) {
      // Show fail modal
      setExportModal({
        visible: true,
        success: false,
        message: "Failed to export report. Please try again.",
      });
      setTimeout(
        () => setExportModal((modal) => ({ ...modal, visible: false })),
        2000
      );
    }
    console.log("Export clicked");
  }

  return (
    <div className="dashboard-bg">
      <nav className="dashboard-nav">
        <div className="nav-left">
          {/* Back button uses SVG arrow */}
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="nav-title">Interactive Disaster Response Dashboard</h1>
        </div>
        <div className="nav-status">
          <LiveWeatherChip />
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Sidebar for filters and export */}
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">Filters</h2>
          <div className="sidebar-section">
            <label>Hazard Type</label>
            <Select
              value={selectedHazard}
              onChange={setSelectedHazard}
              style={{ width: "100%" }}
              placeholder="Select hazard type"
              dropdownClassName="hazard-dropdown"
              optionLabelProp="label"
              className={
                selectedHazard
                  ? `hazard-select hazard-type-${selectedHazard
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`
                  : "hazard-select"
              }
            >
              {hazardTypes.map((h) => (
                <Select.Option
                  key={h}
                  value={h}
                  label={h}
                  className={`hazard-type-${h
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  {h}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="sidebar-section">
            <label>Region</label>
            <input type="text" value="National Capital Region (NCR)" readOnly />
          </div>
          <div className="sidebar-section">
            <label>Cities/Municipality</label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select cities/municipalities"
              value={selectedCities}
              onChange={setSelectedCities}
              options={citiesMunicipality.map((c) => ({
                label: c,
                value: c,
              }))}
              optionLabelProp="label"
            />
            <div style={{ marginTop: "18px" }}>
              <ExportButton
                onClick={handleExport}
                disabled={false}
                format={exportFormat}
                setFormat={setExportFormat}
              />
            </div>
          </div>
        </aside>

        {/* Map section */}
        <main className="dashboard-map">
          <div className="map-header">
            <span className="map-title">National Capital Region (NCR)</span>
            <span className="map-location">Metro Manila | Philippines</span>
          </div>
          <div className="map-wrapper">
            <NCRMap selectedHazard={selectedHazard} mapData={riskData} />
            <RiskLegend
              minimized={legendMinimized}
              onMinimize={() => setLegendMinimized(true)}
              onRestore={() => setLegendMinimized(false)}
            />
          </div>
        </main>

        {/* Risk assessment cards */}
        <aside className="dashboard-risk">
          <h2 className="risk-title">⚠️ Risk Assessment</h2>
          <div className="risk-cards">
            {loading ? (
              <div className="risk-placeholder">Loading risk data...</div>
            ) : selectedHazard && selectedCities.length ? (
              riskData.length ? (
                riskData.map((city) => (
                  <RiskAssessmentCard
                    key={city.NCR}
                    hazard={selectedHazard}
                    city={city.NCR}
                    hazardLevel={city[selectedHazard]}
                    recommendation={city.recommendation}
                  />
                ))
              ) : (
                <div className="risk-placeholder">
                  No risk data found for the selected cities and hazard.
                </div>
              )
            ) : (
              <div className="risk-placeholder">
                Please select at least one city and a hazard type to view the
                risk assessment.
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Floating Help button and modal */}
      <button
        aria-label="Open help modal"
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#1976d2",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          cursor: "pointer",
          zIndex: 1040,
        }}
        onClick={() => setShowHelp(true)}
        title="Show help / onboarding"
      >
        ?
      </button>

      {/* Help modal */}
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

      {/* Export success/fail modal */}
      <SucFailModal
        visible={exportModal.visible}
        success={exportModal.success}
        onClose={() =>
          setExportModal((modal) => ({ ...modal, visible: false }))
        }
        type="Export Report"
        message={exportModal.message}
      />
    </div>
  );
}
