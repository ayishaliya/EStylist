import React from "react";
import Navbar from "../components/Navbar";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="homepage-main-container">
        <div className="homepage-desc-container">
          <div className="homepage-desc">
            <h1>EStylist</h1>
            <p>
              TRANSFORM YOUR WARDROBE WITH PERSONALIZED OUTFIT RECOMMENDATIONS
              AND STYLING ADVICE TAILORED JUST FOR YOU. WHETHER YOU'RE PREPPING
              FOR AN EVENT OR UPDATING YOUR EVERYDAY LOOK, ESTYLIST HELPS YOU
              FEEL CONFIDENT AND STYLISH, EVERY DAY. LET US GUIDE YOU TO THE
              PERFECT LOOK WITH EXPERT FASHION ADVICE, CURATED JUST FOR YOUR
              TASTE AND LIFESTYLE.
            </p>
          </div>
          <div className="homepage-buttons">
            <div className="homepage-button-group">
              <label>Already have an account?</label>
              <Link to="/login">
                <button className="homepage-login-button">LOGIN</button>
              </Link>
            </div>
            <div className="homepage-button-group">
              <label>New User?</label>
              <Link to="/register">
                <button className="homepage-register-button">REGISTER</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
