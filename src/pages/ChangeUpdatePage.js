// Add an extra column for user input (e.g., extraRoute)
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../Utilities/supabase";
import { useNavigate } from "react-router-dom";


export default function ChangeUpdatePage() {
  const [selectedPortNumber, setSelectedPortNumber] = useState("");
  const [leftRoute, setLeftRoute] = useState("");
  const [middleLeftRoute, setMiddleLeftRoute] = useState("");
  const [middleRightRoute, setMiddleRightRoute] = useState("");
  const [rightRoute, setRightRoute] = useState(""); // New 4th column
  const [message, setMessage] = useState("");
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [portList, setPortList] = useState([]);

  const removePort = (portToRemove) => {
    setPortList((prevPortList) =>
      prevPortList.filter((port) => port !== Number(portToRemove))
    );
  };

  const hourOptions = Array.from({ length: 6 }, (_, i) => i);
  const minuteOptions = [0, 1, 15, 30, 45];

  const minuteCounter = (selectedHours, selectedMinutes) => {
    return 60 * parseInt(selectedHours, 10) + parseInt(selectedMinutes, 10);
  };
  const totalMinutes = minuteCounter(selectedHours, selectedMinutes);

  const navigate = useNavigate();
  const directToPortScreen = (userSelectedPortNr) => {
    navigate("/PortDisplay", {
      state: { portNr: userSelectedPortNr },
    });
  };

  const handleTextChange = (e) => {
    if (e.target.value.length <= 40) {
      setMessage(e.target.value);
    }
  };

  useEffect(() => {
    const fetchPortData = async () => {
      try {
        const { data, error } = await supabase
          .from("Port_info")
          .select("port_nr");
        if (error) console.error("Supabase query error:", error);
        else setPortList(data.map((item) => parseInt(item.port_nr, 10)));
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
    fetchPortData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPortNumber) {
      alert("Välj ett portnummer!");
      return;
    }

    if (!(leftRoute || middleLeftRoute || middleRightRoute || rightRoute)) {
      alert("Välj minst ett ruttnummer!");
      return;
    }

    if (totalMinutes <= 0) {
      alert("Tidgräns kan inte vara 0!");
      return;
    }

    const { data: oldData, error: err } = await supabase
      .from("Port_info")
      .select("*")
      .eq("port_nr", selectedPortNumber);

    if (err) console.error("Error fetching data:", err);
    else if (oldData.length > 0) {
      const { error: deleteError } = await supabase
        .from("Port_info")
        .delete()
        .eq("port_nr", selectedPortNumber);
      if (deleteError) console.error("Error deleting records:", deleteError);
    }

  const { data, error } = await supabase.from("Port_info").insert([
    {
      port_nr: selectedPortNumber,
      pos_left: leftRoute,
      pos_middle_left: middleLeftRoute,
      pos_middle_right: middleRightRoute,
      pos_right: rightRoute,
      time_limit: totalMinutes,
      msg: message || null,
    },
  ]);

    if (error) {
      console.error("Fel vid insättning i databasen:", error);
      alert("Ett fel uppstod vid uppdatering av databasen.");
    } else {
      setSelectedPortNumber("");
      setLeftRoute("");
      setMiddleLeftRoute("");
      setMiddleRightRoute("");
      setRightRoute(""); 
      setSelectedHours(1);
      setSelectedMinutes(0);
      setMessage("");
      directToPortScreen(selectedPortNumber);
    }
  };

  const handleDeleteButton = async () => {
    const confirmDelete = window.confirm(
      "Är du säker på att du vill återställa denna skärm?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("Port_info")
        .delete()
        .eq("port_nr", selectedPortNumber);
      if (error) alert("Kunde inte radera posten.");
      else {
        alert("Portdisplayen har återställts");
        removePort(selectedPortNumber);
        setSelectedPortNumber("");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white shadow-lg rounded-4 p-5 border border-3 border-success w-50 mx-auto"
        style={{ maxWidth: "600px", minWidth: "300px" }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img
            src="/arla-logo.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "100px" }}
          />
        </div>

        <h2 className="text-center text-success fw-bold mb-4 border-bottom pb-2">
          Ändra / Uppdatera Information
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="border bg-success bg-opacity-25 mb-4 text-center p-3 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column">
                <label className="form-label fw-bold text-dark text-start">
                  Välj portnumret:
                </label>
                <select
                  value={selectedPortNumber}
                  onChange={(e) => setSelectedPortNumber(e.target.value)}
                  className="form-select border border-success text-dark p-2"
                  style={{ maxWidth: "300px", minWidth: "150px" }}
                >
                  <option value="">Port</option>
                  {Array.from({ length: 26 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              {portList.includes(Number(selectedPortNumber)) && (
                <button
                  type="button"
                  onClick={handleDeleteButton}
                  className="btn btn-danger ms-3 fw-bold p-2"
                >
                  Återställ port {selectedPortNumber}
                </button>
              )}
            </div>
          </div>

          <div className="mb-4 border p-3 rounded">
            <label className="form-label fw-bold text-dark d-block text-center mb-3">
              Ange ruttnummer:
            </label>
            <div className="row g-3 text-center">
              <div className="col-12 col-md-3">
                <h5 className="text-success fw-bold border-bottom pb-1">
                  VÄNSTER
                </h5>
                <input
                  type="text"
                  value={leftRoute}
                  onChange={(e) => setLeftRoute(e.target.value.toUpperCase())}
                  className="form-control border border-success text-dark text-center"
                />
              </div>
              <div className="col-12 col-md-3">
                <h5 className="text-success fw-bold border-bottom pb-1">
                  MITT-VÄNSTER
                </h5>
                <input
                  type="text"
                  value={middleLeftRoute}
                  onChange={(e) =>
                    setMiddleLeftRoute(e.target.value.toUpperCase())
                  }
                  className="form-control border border-success text-dark text-center"
                />
              </div>
              <div className="col-12 col-md-3">
                <h5 className="text-success fw-bold border-bottom pb-1">
                  MITT-HÖGER
                </h5>
                <input
                  type="text"
                  value={middleRightRoute}
                  onChange={(e) =>
                    setMiddleRightRoute(e.target.value.toUpperCase())
                  }
                  className="form-control border border-success text-dark text-center"
                />
              </div>
              <div className="col-12 col-md-3">
                <h5 className="text-success fw-bold border-bottom pb-1">
                  HÖGER
                </h5>
                <input
                  type="text"
                  value={rightRoute}
                  onChange={(e) => setRightRoute(e.target.value.toUpperCase())}
                  className="form-control border border-success text-dark text-center"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 text-center border p-3 rounded">
            <label className="form-label fw-bold text-dark">
              Välj tidsgräns (max 5 timmar):
            </label>
            <div className="d-flex justify-content-center gap-3">
              <select
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
                className="form-select border border-success text-dark p-2"
                style={{ maxWidth: "150px", minWidth: "100px" }}
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} {hour === 1 ? "timme" : "timmar"}
                  </option>
                ))}
              </select>
              <select
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(e.target.value)}
                className="form-select border border-success text-dark p-2"
                style={{ maxWidth: "150px", minWidth: "100px" }}
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 text-center border p-3 rounded">
            <label className="form-label fw-bold text-dark">
              Meddelande (max 40 tecken):
            </label>
            <textarea
              value={message}
              onChange={handleTextChange}
              className="form-control border border-success text-dark mx-auto text-center"
              rows="1"
              maxLength="40"
              style={{ width: "100%", maxWidth: "400px", minWidth: "150px" }}
            />
            <small className="text-muted d-block mt-1">
              {40 - message.length} tecken kvar
            </small>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold p-2">
            Uppdatera
          </button>
        </form>
      </div>
    </div>
  );
}
