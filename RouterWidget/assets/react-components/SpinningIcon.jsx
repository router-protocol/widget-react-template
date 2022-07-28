import React from "react";
const SpinningIcon = ({ color = "#00A0BE" }) => {
  return (
    <svg
        width="150"
        height="150"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M155.83 182.976C139.886 193.725 120.676 200 100 200C44.7715 200 0 155.229 0 100C0 44.7715 44.7715 0 100 0C155.229 0 200 44.7715 200 100H194C194 48.0854 151.915 6 100 6C48.0854 6 6 48.0854 6 100C6 151.915 48.0854 194 100 194C119.435 194 137.492 188.102 152.48 177.998L155.83 182.976Z"
          fill="url(#paint0_linear_1849_1281)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1849_1281"
            x1="194.5"
            y1="90.5"
            x2="159"
            y2="237"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color={color} />
            <stop offset="1" stop-color={color} stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
  );
};

export default SpinningIcon