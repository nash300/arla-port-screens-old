/* ////////////////////////////////////////////////////////////////////////////////////////// 
PURPOSE:
This is the page that the display screen shows.

PARAMETERS 


FUNCTIONALITY:
* retrieves information to be displayed for the corresponding screen
* Communicating with the database to get real-time change alerts to the table.
* If no records for the screen are present in the database, outputs an image (default image)
///////////////////////////////////////////////////////////////////////////////////////////*/

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../Utilities/supabase.js";
import RootNumber from "../components/RootNumber.js";

export default function PortDisplay() {
  const location = useLocation();
  const portNr = Number(location.state?.portNr);

  const [portInfo, setPortInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cowTrigger, setCowTrigger] = useState(0); // triggers cow animation every 10s

  const rotatingStyle = {
    animation: "rotateY360 6s ease-in-out infinite",
    transformStyle: "preserve-3d",
    width: "600px",
  };

  const fetchPortData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!portNr || isNaN(portNr)) {
        setErrorMessage("Invalid port number.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Port_info")
        .select("*")
        .eq("port_nr", portNr);

      if (error) {
        console.error("Supabase query error:", error);
        setErrorMessage("Error fetching port data.");
      } else {
        setPortInfo(data.length > 0 ? data : null);

        if (!data.some((item) => item.msg)) {
          setPortInfo((prev) => prev?.map((item) => ({ ...item, msg: null })));
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("Failed to load port data.");
    } finally {
      setLoading(false);
    }
  };

  // fetch port data on mount or portNr change
  useEffect(() => {
    if (portNr) fetchPortData();
  }, [portNr]);

  // subscribe to realtime updates
  useEffect(() => {
    if (!portNr || isNaN(portNr)) return;

    const channel = supabase
      .channel("realtime-ports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Port_info" },
        () => fetchPortData()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [portNr]);

  // trigger cow animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCowTrigger((prev) => prev + 1);
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <div
        className="bg-dark text-white d-flex align-items-center justify-content-center text-center"
        style={{ height: "20vh" }}
      >
        <div className="d-flex align-items-center justify-content-center gap-3">
          <img
            src="/arla-logo.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "120px" }}
          />
          <h1
            className="m-0 fw-bolder"
            style={{ fontSize: "calc(10vh + 2vw)", whiteSpace: "nowrap" }}
          >
            PORT {portNr}
          </h1>
        </div>
      </div>

      {/* Middle Section */}
      <div className="d-flex flex-grow-1 justify-content-center">
        <div className="container-fluid h-100">
          <div className="row h-100 gap-2 justify-content-center">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center w-100 h-100">
                <p>Loading data...</p>
              </div>
            ) : !portInfo ? (
              <div className="d-flex align-items-center justify-content-center w-100 h-100">
                <img
                  src="/cow.png"
                  alt="No data"
                  className="img-fluid"
                  style={rotatingStyle}
                />
                <style>
                  {`
                  @keyframes rotateY360 {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                  }
                  `}
                </style>
              </div>
            ) : (
              portInfo.map((item, index) => (
                <div key={index} className="row">
                  {[
                    { label: "VÄNSTER", value: item.pos_left },
                    { label: "MITT-VÄNSTER", value: item.pos_middle_left },
                    { label: "MITT-HÖGER", value: item.pos_middle_right },
                    { label: "HÖGER", value: item.pos_right },
                  ].map(({ label, value }, idx) => (
                    <div key={idx} className="col-3 d-flex flex-column p-2">
                      <div
                        className="bg-dark text-white p-3 rounded-top text-center fw-bold d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "clamp(3rem, 5vw, 2rem)",
                          minHeight: "60px",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        className="shadow rounded-bottom text-center d-flex align-items-center justify-content-center h-100 animate-box"
                        style={{ overflow: "hidden" }}
                      >
                        {value !== undefined && (
                          <div
                            style={{
                              fontSize: "clamp(6vw, 8vw, 10vw)",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "100%",
                            }}
                          >
                            <RootNumber rootNr={value} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {portInfo && portInfo.some((item) => item.msg !== null) && (
        <div
          className="bg-warning text-white d-flex align-items-center justify-content-center text-center position-relative overflow-hidden"
          style={{ height: "15vh" }}
        >
          {/* Message Text */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1
              className="blinking-text fw-bold text-black"
              style={{ fontSize: "calc(6vh + 2vw)", whiteSpace: "nowrap" }}
            >
              {portInfo.find((item) => item.msg)?.msg}
            </h1>
          </div>

          {/* Running cow GIF */}
          <img
            key={cowTrigger}
            src="/running-cow.gif"
            alt="Cow Animation"
            className="moving-cow"
            style={{
              position: "absolute",
              top: "40%",
              left: "-200px",
              height: "110%",
              transform: "translateY(-50%)",
              animation: "moveCow 6s linear 1",
            }}
          />

          <style>
            {`
              @keyframes moveCow {
                0% { left: -100px; }
                100% { left: 100%; }
              }

              @keyframes blinkEffect {
                0% { opacity: 0; }
                50% { opacity: 0.9; }
                100% { opacity: 1; }
              }

              .blinking-text {
                animation: blinkEffect 3s infinite ease-in-out;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
