// src/AboutModal.jsx

import React from "react";
import "../../styles/Modal.css";

/**
 * AboutModal component displays information about the dashboard in a modal dialog.
 *
 * Props:
 * - open (boolean): Controls visibility of the modal.
 * - onClose (function): Callback to close the modal.
 *
 * Usage:
 * <AboutModal open={isOpen} onClose={handleClose} />
 */
export default function AboutModal({ open, onClose }) {
  // If modal is not open, don't render anything
  if (!open) return null;

  return (
    // Modal overlay covers the whole screen; clicking it closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content stops click propagation, so clicking inside doesn't close modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">About This Dashboard</h2>
          {/* Close button in header */}
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close About Modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {/* Main description about the dashboard */}
          <p>
            This dashboard is designed for Philippine LGUs and disaster
            responders to provide real-time situational awareness and actionable
            insights during critical moments. Built with modern web technologies
            and optimized for emergency response.
          </p>
          <ul>
            <li>Real-time monitoring and predictive analytics</li>
            <li>Historical mapping and risk assessment</li>
            <li>Data sourced from official agencies</li>
          </ul>
          {/* Contact information */}
          <p>
            Contact:{" "}
            <a href="mailto:MARBELLS.IDRD@gmail.com">MARBELLS.IDRD@gmail.com</a>
          </p>
        </div>
        <div className="modal-footer">
          {/* Footer close button */}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
