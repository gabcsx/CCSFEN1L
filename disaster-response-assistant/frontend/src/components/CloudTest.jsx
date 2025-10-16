// CloudTest.jsx

import React from "react";
import "../styles/CloudTest.css";

/**
 * CloudTest
 * Renders an animated cloud background using styled divs,
 * and a headline asking the user if they see clouds.
 *
 * The actual cloud shapes and animations are handled via CSS in CloudTest.css.
 */
export default function CloudTest() {
  return (
    <>
      {/* 
        Cloud background container.
        Each .xN div positions and animates a cloud differently.
        The .cloud div inside each is styled in CSS to look and animate like a cloud.
      */}
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

      {/* 
        Main content area.
        Ensures the text stays above the clouds using zIndex and relative positioning.
      */}
      <div style={{ minHeight: "100vh", zIndex: 1, position: "relative" }}>
        <h1 style={{ textAlign: "center", marginTop: "200px" }}>
          Do you see clouds?
        </h1>
      </div>
    </>
  );
}
