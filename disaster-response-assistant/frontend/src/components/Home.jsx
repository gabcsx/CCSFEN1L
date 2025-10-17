// Home.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import pinIcon from "../assets/pin.png";
import warningIcon from "../assets/warning.png";
import chartIcon from "../assets/chart.png";
import AboutModal from "./Modal/AboutModal";

export default function Home() {
  // State for showing/hiding the About modal
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {/* ===== Animated Cloud Background ===== */}
      <div id="background-wrap">
        <div className="x1">
          <div className="cloud"></div>
        </div>
        <div className="x2">
          <div className="cloud"></div>
        </div>
        <div className="x3">
          <div className="cloud"></div>
        </div>
        <div className="x4">
          <div className="cloud"></div>
        </div>
        <div className="x5">
          <div className="cloud"></div>
        </div>
      </div>

      {/* ===== Main Home Content ===== */}
      <div className="home-bg">
        <div className="home-content">
          {/* Title and subtitle */}
          <h1>Interactive Disaster Response Dashboard</h1>
          <div className="predictive">with Predictive Analytics</div>

          {/* Description */}
          <div className="desc">
            A comprehensive real-time monitoring and response system designed
            for Local Government Units (LGUs) and disaster responders in the
            Philippines. Providing actionable insights during critical moments.
          </div>

          {/* Launch Dashboard Button */}
          <Link to="/dashboard">
            <button className="launch-btn" aria-label="Launch Dashboard">
              Launch Dashboard
            </button>
          </Link>

          {/* ===== Feature Cards ===== */}
          <div className="feature-grid">
            {/* Historical Mapping */}
            <div className="feature-card">
              <div className="feature-dot green">
                <img
                  src={pinIcon}
                  alt="Historical Mapping icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="feature-title">Historical Mapping</div>
              <div className="feature-desc">
                Interactive map of Metro Manila with city-level risk zones,
                recent and historical hazard data, and real-time weather
                overlays for comprehensive situational awareness.
              </div>
            </div>
            {/* Risk Assessment */}
            <div className="feature-card">
              <div className="feature-dot yellow">
                <img
                  src={warningIcon}
                  alt="Risk Assessment icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="feature-title">Risk Assessment</div>
              <div className="feature-desc">
                Dynamic, color-coded risk levels (Low, Medium, High) for each
                city and hazard, with actionable recommendations, population
                impact analysis, and easy export to PDF or Excel.
              </div>
            </div>
            {/* Predictive Analytics */}
            <div className="feature-card">
              <div className="feature-dot blue">
                <img
                  src={chartIcon}
                  alt="Predictive Analytics icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="feature-title">Predictive Analytics</div>
              <div className="feature-desc">
                Integrated forecasting and risk predictions using historical
                data, clustering models, and real-time hazard selection,
                enabling informed planning and rapid disaster response.
              </div>
            </div>
          </div>

          {/* ===== Current Disaster Status Section ===== */}
          <h2 className="status-title">Current Disaster Status</h2>
          <div className="status">
            <div className="status-items">
              {/* Active Disasters */}
              <div>
                <a
                  href="https://hazardhunter.georisk.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="red status-link"
                  aria-label="Active Disasters in NCR"
                >
                  1
                </a>
                <div className="status-label">Active Disasters</div>
              </div>
              {/* Barangays Affected */}
              <div>
                <a
                  href="https://pco.gov.ph/news_releases/ndrrmc-advises-metro-manila-barangays-of-possible-flooding-due-to-typhoon-nando/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="orange status-link"
                  aria-label="Barangays Affected in NCR"
                >
                  939
                </a>
                <div className="status-label">Barangays Affected</div>
              </div>
              {/* Evacuation Centers */}
              <div>
                <a
                  href="https://scontent.fmnl22-1.fna.fbcdn.net/v/t39.30808-6/553542779_1133267295653724_3730638163108697289_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=uKPbBN1gXLgQ7kNvwG_3alB&_nc_oc=Adna8TDEoS8kMfeUC2M8jLGbjx7yzc1hhpqKxDCAv7d_KZmRCzqbR38XaEQuuStEUyE&_nc_zt=23&_nc_ht=scontent.fmnl22-1.fna&_nc_gid=gI2jXpsdMK8qV4Z4yKY9eQ&oh=00_Afd71QnxJ8UlwKvkXYj3L48RdCmVYepZ4n4AlcSbL1CTbw&oe=68F84226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="green status-link"
                  aria-label="Evacuation Centers Details"
                >
                  31
                </a>
                <div className="status-label">Evacuation Centers</div>
              </div>
            </div>
          </div>

          {/* ===== Prototype Preview Text ===== */}
          <div className="preview-text">
            Interactive prototype • Real-time data simulation • Full
            functionality preview
          </div>

          {/* ===== Footer Buttons ===== */}
          <div className="footer-btns">
            <a
              className="footer-btn"
              href="https://psa.gov.ph/content/total-225-small-scale-natural-hazard-occurred-philippines-2024"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Latest Reports"
            >
              Latest Reports
            </a>
            <a
              className="footer-btn"
              href="https://www.pagasa.dost.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Typhoon Tracker"
            >
              Typhoon Tracker
            </a>
            <a
              className="footer-btn"
              href="https://www.facebook.com/photo/?fbid=1251851950311655&set=a.472829298213928"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact LGU"
            >
              Contact LGU
            </a>
            {/* About Button triggers modal */}
            <button
              className="footer-btn footer-btn-about"
              onClick={() => setShowAbout(true)}
              aria-label="About"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              About
            </button>
          </div>

          {/* ===== Footer Text ===== */}
          <div className="final-footer-text">
            Designed for Philippine LGUs • Built with modern web technologies •
            Optimized for emergency response
          </div>

          {/* ===== About Modal ===== */}
          <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
        </div>
      </div>
    </>
  );
}
