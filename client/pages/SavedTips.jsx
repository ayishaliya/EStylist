import React, { useState, useEffect } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import "./Tips.css";
import Navbar from "../components/Navbar";

const SavedTips = () => {
  const [savedTips, setSavedTips] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/tips/saved/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          const uniqueTips = Array.from(
            new Map(data.map((tip) => [tip.tipId, tip])).values()
          );
          setSavedTips(uniqueTips.slice(0, 9));
        })
        .catch(() => message.error("Failed to fetch saved tips"));
    }
  }, [savedTips]);

  const removeSavedTip = async (tipId) => {
    try {
      console.log("Removing Tip ID:", tipId);

      const response = await fetch("http://localhost:5000/api/tips/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, tipId }),
      });

      if (!response.ok) throw new Error("Failed to remove tip");

      setSavedTips((prevTips) => prevTips.filter((tip) => tip.tipId !== tipId));

      message.success("Tip removed");
    } catch (error) {
      message.error("Failed to remove tip");
    }
  };

  return (
    <div className="tips-body">
      <Navbar />
      <div className="fashion-tips-container">
        <div className="fashion-tips-header">
          <h1 className="fashion-tips-heading">Saved Tips</h1>
        </div>

        {savedTips.length === 0 ? (
          <div className="no-saved-tips">
            <p className="no-saved-p">
              No tips saved.{" "}
              <Link to="/tips" className="tips-link">
                Save tips
              </Link>{" "}
              to view.
            </p>
          </div>
        ) : (
          <div className="tips-grid">
            {savedTips.map((tip) => (
              <div key={tip._id} className="tip-box">
                <button
                  className="tips-save-btn"
                  onClick={() => removeSavedTip(tip.tipId)}
                >
                  -
                </button>
                <h2 className="tip-title">{tip.title}</h2>
                <p className="tip-detail">{tip.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTips;
