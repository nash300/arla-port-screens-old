/* /////////////////////////////////////////////////////////////////////////////// 
PURPOSE:
This is the first landing page for the site.
Performs user authentifications.

PARAMETERS 
correctUserName | hard corded username for the site
correctPassword | hard corded password for the site

FUNCTIONALITY:
Checks and validates user input login data with the hardcorded data
////////////////////////////////////////////////////////////////////////////////*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

export default function LogInPage() {
  const correctUserName = "Gs1"; // Hardcoded credentials
  const correctPassword = "Start1234";

  const [userName, setUserName] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input

  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission refresh

    if (userName === correctUserName && password === correctPassword) {
      navigate("/MenuPage"); // Redirect to Menu Page
    } else {
      alert("Fel Användarnamn eller Lösenord!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <div className="row g-0">
          {/************** Logo Section *************************/}
          <div className="col-md-5 d-flex align-items-center justify-content-center bg-light">
            <img
              src="/arla-logo.png"
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "120px" }}
            />
          </div>

          {/****************** Form Section **********************/}
          <div className="col-md-7 p-4">
            <h3
              className="mb-3 text-center"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              InfoSync
            </h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Användarnamn</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)} // Update username state
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Lösenord</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Logga in
                </button>
              </div>
            </form>
          </div>
        </div>

        {/*************** Footer Section for Credits ****************/}
        <footer className="text-center mt-4">
          <hr />
          <p className="text-muted mb-1">Developed by Nadeesha Aravinda</p>
          <p className="text-muted small">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
