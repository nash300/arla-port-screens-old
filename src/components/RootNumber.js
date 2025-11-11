/* /////////////////////////////////////////////////////////////////////////// 
PURPOSE:
This is a custom component to display the route numbers with a 3D button look.

PARAMETERS:
rootNr | a string representing a route number.

FUNCTIONALITY:
* Displays the route number with a 3D styled box.
* Ignores the display if no parameter is present.
///////////////////////////////////////////////////////////////////////////*/

import React from "react";

const RootNumber = ({ rootNr }) => {
  // If rootNr is not provided, return nothing (empty div)
  if (!rootNr) return <div></div>;

  return (
    <div className="root-number">
      <p className="shiny-text">{rootNr}</p>

      <style>
        {`
          /* Container with 3D button effect */
          .root-number {
            width: 100%;
            height: 100%; 
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            text-align: center;
            border-radius: 15px;

            /* Gradient background */
            background: linear-gradient(145deg, #28a745, #1c7b32ff);
          }
            
          /* Text styling with glow */
          .shiny-text {
            color: white;
            text-shadow:
              1px 12px 15px rgba(0, 0, 0, 0.54),   /* dark shadow for depth */
              0 0 0px rgba(255,255,255,0.6); /* soft glow */
          }
        `}
      </style>
    </div>
  );
};

export default RootNumber;
