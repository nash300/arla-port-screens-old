/* /////////////////////////////////////////////////////////////////////////////// 
PURPOSE:
This is a custom component to display the route numbers.

PARAMETERS:
rootNr | an string that representate a route number.

FUNCTIONALITY:
* Reading the in comming parameter (route number) and display it with CSS styling.
* Ignores the space if no in-parameter is present.
////////////////////////////////////////////////////////////////////////////////*/

import React from "react";

const RootNumber = ({ rootNr }) => {
  // If rootNr is not provided, return nothing (empty div)
  if (!rootNr) return <div></div>;

  return (
    <div className="root-number bg-success bg-gradient">
      <p className="shiny-text">{rootNr}</p>

      {/* CSS Styling */}
      <style>
        {`
          /* Container with 3D Effect */
          .root-number {
            width: 100%;
            height: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            text-align: center;


            border-radius: 15px; 
            background: linear-gradient(145deg, #28a745, #1e7e34); 
          
          }

          /* Improved Text Shadow Effect */
          .shiny-text {
            color: white;
            text-shadow: 
              2px 2px 5px rgba(0, 0, 0, 0.8), /* Dark shadow for depth */
              0px 0px 10px rgba(255, 255, 255, 0.6); /* Soft glow */
          }
        `}
      </style>
    </div>
  );
};

export default RootNumber;
