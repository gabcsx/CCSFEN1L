// SucFailModal.jsx

import React, { useEffect, useState } from "react";
import "../../styles/SucFailModal.css";

// SVG icon for success
const CheckIcon = () => (
  <svg width="85" height="85" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="19" fill="#22c55e" />
    <path
      d="M11 20.5L17 26.5L27 14.5"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// SVG icon for failure
const XIcon = () => (
  <svg width="85" height="85" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="19" fill="#ef4444" />
    <path
      d="M13 13L25 25M25 13L13 25"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * SucFailModal
 * Shows a modal popup for success or failure feedback (e.g. after export).
 *
 * Props:
 * - visible (boolean): Controls modal visibility.
 * - success (boolean): If true, show success icon/message; else failure.
 * - onClose (function): Callback when modal closes.
 * - type (string): Type of operation (shown as header).
 * - message (string): Custom message to display.
 * - duration (number): ms to auto-close modal (default: 2800).
 */
export default function SucFailModal({
  visible,
  success,
  onClose,
  type = "Export Report",
  message,
  duration = 2800,
}) {
  // Local state for showing/hiding modal and animation
  const [show, setShow] = useState(visible);
  const [isHiding, setIsHiding] = useState(false);

  // Effect: Handles auto-close timer when visible
  useEffect(() => {
    let autoCloseTimer;
    if (visible) {
      setShow(true); // Show modal
      setIsHiding(false); // Reset hiding state
      // Start auto-close timer
      autoCloseTimer = setTimeout(() => {
        setIsHiding(true); // Start fade-out animation
      }, duration);
    }
    return () => clearTimeout(autoCloseTimer); // Clean up timer
  }, [visible, duration]);

  // Effect: Handles fade-out and unmount after animation
  useEffect(() => {
    let fadeOutTimer;
    if (isHiding) {
      // After fade-out animation, hide modal and call onClose
      fadeOutTimer = setTimeout(() => {
        setShow(false);
        setIsHiding(false);
        if (onClose) onClose();
      }, 300); // Match CSS animation duration
    }
    return () => clearTimeout(fadeOutTimer);
  }, [isHiding, onClose]);

  // Effect: Syncs local state with visible prop
  useEffect(() => {
    if (visible) {
      setShow(true);
      setIsHiding(false);
    } else if (show) {
      setIsHiding(true);
    }
  }, [visible, show]);

  // If not showing, render nothing
  if (!show) return null;

  // Dynamic icon and message classes
  const iconClass = success
    ? "icon-container succes succes-animation"
    : "icon-container danger danger-animation";
  const defaultMsg = success
    ? "Report exported successfully!"
    : "Please select at least one city and a hazard type before exporting.";
  const displayMessage = message || defaultMsg;

  // Handler for manual close button
  const handleClose = () => {
    setIsHiding(true);
  };

  return (
    <div className="modal-backdrop">
      <div className={`custom-modal export-modal${isHiding ? " hide" : ""}`}>
        {/* Close button */}
        <button
          className="modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* Success/failure icon */}
        <div className={iconClass}>{success ? <CheckIcon /> : <XIcon />}</div>
        {/* Modal content */}
        <div className="content">
          <p className="type">{type}</p>
          <p className="message-type">{displayMessage}</p>
        </div>
      </div>
    </div>
  );
}
