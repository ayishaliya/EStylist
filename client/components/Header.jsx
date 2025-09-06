import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import "./Header.css";

export default function Header({ loginUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    message.success("Logged Out successfully !");
    navigate("/login");
  };

  return (
    <header className="main-navbar">
      <div className="main-navbar-container">
        <Link className="main-logo" to="/main">
          <h1 className="h1-mainpage">EStylist</h1>
        </Link>
        <nav>
          <ul className="main-nav-links">
            <li>
              <Link to="/tips">Fashion Tips</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {loginUser && (
              <li>
                <button
                  className="saved-fits-btn"
                  onClick={() => navigate(`/saved-outfits/${loginUser._id}`)}
                >
                  Saved Fits
                </button>
              </li>
            )}
            {loginUser && (
              <li
                className="main-user-name"
                onClick={() => navigate(`/profile/${loginUser._id}`)}
              >
                {loginUser.name}
              </li>
            )}
            <li>
              <button className="main-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
