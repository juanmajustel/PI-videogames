import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32"></circle>
        </svg>
      </div>
      <div className="loader">
        <svg viewBox="0 0 86 80" className="triangle">
          <polygon points="43 8 79 72 7 72"></polygon>
        </svg>
      </div>
      <div className="loader">
        <svg viewBox="0 0 80 80">
          <rect x="8" y="8" width="64" height="64"></rect>
        </svg>
      </div>
    </div>
  );
};

export default Spinner;
