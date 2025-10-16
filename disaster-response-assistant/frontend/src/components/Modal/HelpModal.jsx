// HelpModal.jsx

import React from "react";
import "../../styles/Modal.css";

/**
 * HelpModal component displays a help and guide modal for dashboard users.
 *
 * Props:
 * - open (boolean): Controls visibility of the modal.
 * - onClose (function): Callback to close the modal.
 *
 * Usage:
 * <HelpModal open={isHelpOpen} onClose={handleHelpClose} />
 */
export default function HelpModal({ open, onClose }) {
  // If modal is not open, don't render anything
  if (!open) return null;

  return (
    // Modal overlay covers the whole screen; clicking it closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content stops click propagation, so clicking inside doesn't close modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button at the top right of the modal */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-header">
          <h2 className="modal-title">Dashboard Help & Guide</h2>
        </div>
        <div className="modal-body">
          {/* Section: How to Use the Dashboard */}
          <h3 className="section-title">How to Use the Dashboard</h3>
          <ol className="modal-list">
            <li className="modal-list-item">
              <strong>Filter Data:</strong> Use the filters to select a hazard
              type, region, and city/municipality.
            </li>
            <li className="modal-list-item">
              <strong>View Map:</strong> Check the map for risk levels (Red =
              High, Orange = Medium, Green = Low).
            </li>
            <li className="modal-list-item">
              <strong>Check Risk Assessment:</strong> See details for each city
              on the right, including recommended actions.
            </li>
            <li className="modal-list-item">
              <strong>Export Reports:</strong> Click Export Report to download
              PDF or Excel files.
            </li>
            <li className="modal-list-item">
              <strong>Legend:</strong> Use the Risk Level Legend to interpret
              map colors.
            </li>
          </ol>

          {/* Section: FAQ & Glossary */}
          <h3 className="section-title">FAQ & Glossary</h3>
          <dl className="faq-dl">
            {/* FAQ: Risk Levels */}
            <dt className="faq-dt">
              <strong>What do “Risk Levels” mean?</strong>
            </dt>
            <dd className="faq-dd">
              <p>
                <strong>High: Immediate threat. Take urgent action.</strong>
                <br />A dangerous event is imminent or in progress. Follow
                emergency instructions without delay.
              </p>
              <p>
                <strong>Medium: Potential threat. Stay alert.</strong>
                <br />
                Conditions are favorable for a hazard to develop. Monitor
                updates and be ready to act.
              </p>
              <p>
                <strong>
                  Low: Minimal threat. Prepare basic emergency plans.
                </strong>
                <br />A hazard is unlikely in the near future. Use this time to
                prepare and review your plans.
              </p>
            </dd>
            {/* FAQ: Hazard Type */}
            <dt className="faq-dt">
              <strong>What is “Hazard Type”?</strong>
            </dt>
            <dd className="faq-dd">
              The specific kind of natural disaster being monitored by the
              system, such as Flood, Storm Surge, or Earthquake-Induced
              Landslide.
            </dd>
            {/* FAQ: Predictive Analytics */}
            <dt className="faq-dt">
              {" "}
              <strong>What is “Predictive Analytics”?</strong>
            </dt>
            <dd className="faq-dd">
              The technology used to forecast future events. The system analyzes
              large datasets (e.g., historical patterns, real-time sensor data)
              to calculate the probability of a hazard affecting a specific
              area.
            </dd>
            {/* FAQ: Export Data */}
            <dt className="faq-dt">
              <strong>How do I export data?</strong>
            </dt>
            <dd className="faq-dd">
              First, select a Hazard Type and City in the Filters panel. Then,
              click the "Export Report" button to download the data as a PDF or
              Excel file.
            </dd>
            {/* FAQ: City Selection */}
            <dt className="faq-dt">
              <strong>How are cities selected?</strong>
            </dt>
            <dd className="faq-dd">
              Choose one or more cities from the "Cities/Municipality" dropdown
              menu in the Filters panel to focus the map and risk assessment on
              those areas.
            </dd>
          </dl>
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
