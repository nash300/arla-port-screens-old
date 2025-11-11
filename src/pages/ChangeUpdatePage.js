import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../Utilities/supabase";
import { useNavigate } from "react-router-dom";

export default function ChangeUpdatePage() {
  const [selectedPortNumber, setSelectedPortNumber] = useState("");
  const [leftRoute, setLeftRoute] = useState("");
  const [middleLeftRoute, setMiddleLeftRoute] = useState("");
  const [middleRightRoute, setMiddleRightRoute] = useState("");
  const [rightRoute, setRightRoute] = useState("");
  const [message, setMessage] = useState("");
  const [selectedHours, setSelectedHours] = useState(10);
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [portList, setPortList] = useState([]);

  const navigate = useNavigate();

  const hourOptions = [0, 1, 5, 10, 15, 24];
  const minuteOptions = [1, 30];

  const removePort = (portToRemove) => {
    setPortList((prev) => prev.filter((port) => port !== Number(portToRemove)));
  };

  const handleTextChange = (e) => {
    if (e.target.value.length <= 40) setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const { data, error } = await supabase
          .from("Port_info")
          .select("port_nr");
        if (error) throw error;
        setPortList(data.map((item) => parseInt(item.port_nr, 10)));
      } catch (err) {
        console.error("Error loading port list:", err);
      }
    };
    fetchPorts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse numeric values safely
    const hours = parseInt(selectedHours, 10) || 0;
    const minutes = parseInt(selectedMinutes, 10) || 0;
    const totalMinutes = hours * 60 + minutes;

    if (!selectedPortNumber) return alert("Välj ett portnummer!");
    if (!(leftRoute || middleLeftRoute || middleRightRoute || rightRoute))
      return alert("Välj minst ett ruttnummer!");
    if (totalMinutes <= 0) return alert("Tidgräns kan inte vara 0!");

    try {
      // Remove any old data for that port
      const { error: deleteError } = await supabase
        .from("Port_info")
        .delete()
        .eq("port_nr", selectedPortNumber);
      if (deleteError) throw deleteError;

      // Insert new data
      const { error } = await supabase.from("Port_info").insert([
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

      if (error) throw error;

      // Reset form
      setSelectedPortNumber("");
      setLeftRoute("");
      setMiddleLeftRoute("");
      setMiddleRightRoute("");
      setRightRoute("");
      setSelectedHours(0);
      setSelectedMinutes(1);
      setMessage("");

      // Go to display screen via URL param
      navigate(`/PortDisplay/${selectedPortNumber}`);
    } catch (err) {
      console.error("Database error:", err);
      alert("Ett fel uppstod vid uppdatering av databasen.");
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
      if (error) throw error;
      alert("Portdisplayen har återställts");
      removePort(selectedPortNumber);
      setSelectedPortNumber("");
    } catch (err) {
      console.error("Error deleting port:", err);
      alert("Kunde inte radera posten.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white shadow-lg rounded-4 p-5 border border-3 border-success w-50 mx-auto"
        style={{ maxWidth: "600px", minWidth: "300px" }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img src="/arla-logo.png" alt="Logo" style={{ maxWidth: "100px" }} />
        </div>

        <h2 className="text-center text-success fw-bold mb-4 border-bottom pb-2">
          Ändra / Uppdatera Information
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Port selection */}
          <div className="border bg-success bg-opacity-25 mb-4 text-center p-3 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column">
                <label className="form-label fw-bold text-dark text-start">
                  Portnummer:
                </label>
                <select
                  value={selectedPortNumber}
                  onChange={(e) => setSelectedPortNumber(e.target.value)}
                  className="form-select border border-success text-dark p-2"
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

          {/* Routes */}
          <div className="mb-4 border p-3 rounded">
            <label className="form-label fw-bold text-dark d-block text-center mb-3">
              Ruttnummer:
            </label>
            <div className="row g-3 text-center">
              {[
                { label: "VÄNSTER", value: leftRoute, set: setLeftRoute },
                {
                  label: "MITT-VÄNSTER",
                  value: middleLeftRoute,
                  set: setMiddleLeftRoute,
                },
                {
                  label: "MITT-HÖGER",
                  value: middleRightRoute,
                  set: setMiddleRightRoute,
                },
                { label: "HÖGER", value: rightRoute, set: setRightRoute },
              ].map(({ label, value, set }, idx) => (
                <div className="col-12 col-md-3" key={idx}>
                  <h5 className="text-success fw-bold border-bottom pb-1">
                    {label}
                  </h5>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => set(e.target.value.toUpperCase())}
                    className="form-control border border-success text-dark text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-4 text-center border p-3 rounded">
            <label className="form-label fw-bold text-dark">
              Tidsgräns (max 24 timmar):
            </label>
            <div className="d-flex justify-content-center gap-3">
              <select
                value={selectedHours}
                onChange={(e) => setSelectedHours(Number(e.target.value))}
                className="form-select border border-success text-dark p-2"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} tim
                  </option>
                ))}
              </select>

              <select
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                className="form-select border border-success text-dark p-2"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
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
