import React from "react";
const CompletedIcon = ({ color = "#E8425A" }) => {
  return (
    <svg width="172" height="172" viewBox="0 0 172 172" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="86" cy="86" r="84" stroke={color} stroke-width="4" stroke-linejoin="round"/>
<path d="M50 83L76 108L123.5 63" stroke={color} stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  );
};

export default CompletedIcon