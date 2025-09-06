import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./Tips.css";
import Navbar from "../components/Navbar";

const { TextArea } = Input;

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [savedTipIds, setSavedTipIds] = useState(new Set());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTip, setNewTip] = useState({ title: "", detail: "" });
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/tips/saved/${user._id}`)
        .then((res) => res.json())
        .then((savedData) => {
          const savedIds = new Set(
            savedData.map((tip) => tip.tipId || tip._id)
          );
          setSavedTipIds(savedIds);
          fetchUnsavedTips(savedIds);
        })
        .catch(() => message.error("Failed to fetch saved tips"));
    } else {
      fetchAllTips();
    }
  }, [user]);

  const fetchUnsavedTips = (savedIds) => {
    fetch("http://localhost:5000/api/tips/unsaved/" + user?._id)
      .then((response) => response.json())
      .then((unsavedTips) => {
        // Ensure client-side filtering
        const filteredTips = unsavedTips.filter(
          (tip) => !savedIds.has(tip._id)
        );
        setTips(filteredTips.slice(0, 9));
      })
      .catch((error) => console.error("Error fetching unsaved tips:", error));
  };

  const fetchAllTips = () => {
    fetch("http://localhost:5000/api/tips/all")
      .then((response) => response.json())
      .then((allTips) => {
        setTips(allTips.slice(0, 9));
      })
      .catch((error) => console.error("Error fetching all tips:", error));
  };

  const replaceTip = (index) => {
    fetch("http://localhost:5000/api/tips/replace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayedTips: tips.map((t) => t._id) }),
    })
      .then((response) => response.json())
      .then((newTip) => {
        if (newTip && !savedTipIds.has(newTip._id)) {
          setTips((prevTips) => {
            const updatedTips = [...prevTips];
            updatedTips[index] = newTip;
            return updatedTips;
          });
        } else {
          replaceTip(index);
        }
      })
      .catch((error) => console.error("Error replacing tip:", error));
  };

  const saveTip = async (tip, index) => {
    if (!user) return message.error("Please log in");
    if (savedTipIds.has(tip._id)) return message.warning("Tip already saved");

    try {
      const res = await fetch("http://localhost:5000/api/tips/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          tipId: tip._id,
          title: tip.title,
          detail: tip.detail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        message.success("Tip saved!");
        setSavedTipIds((prev) => new Set([...prev, tip._id]));
        replaceTip(index);
      }
    } catch (error) {
      message.error("Failed to save tip");
    }
  };

  const handleAddTip = () => {
    fetch("http://localhost:5000/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTip),
    })
      .then((response) => response.json())
      .then(() => {
        setIsModalVisible(false);
        setNewTip({ title: "", detail: "" });
        message.success("Tip Added!");
        fetchUnsavedTips(savedTipIds);
      })
      .catch((error) => console.error("Error adding tip:", error));
  };

  return (
    <div className="tips-body">
      <Navbar />
      <div className="fashion-tips-container">
        <div className="fashion-tips-header">
          <h1 className="fashion-tips-heading">Styling Tips</h1>
          <div className="add-tip-container">
            <button
              className="tips-btn"
              onClick={() => setIsModalVisible(true)}
            >
              + Add Tip
            </button>
            {user && (
              <button
                className="saved-tips-btn"
                onClick={() => navigate(`/saved/${user._id}`)}
              >
                Saved Tips
              </button>
            )}
          </div>
        </div>
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={tip._id} className="tip-box">
              {user && (
                <button
                  className={`tips-save-btn ${
                    savedTipIds.has(tip._id) ? "saved" : ""
                  }`}
                  onClick={() => saveTip(tip, index)}
                  disabled={savedTipIds.has(tip._id)}
                >
                  {savedTipIds.has(tip._id) ? "✔" : "💾"}
                </button>
              )}
              <button className="close-btn" onClick={() => replaceTip(index)}>
                ×
              </button>
              <h2 className="tip-title">{tip.title}</h2>
              <p className="tip-detail">{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Add a New Tip"
        open={isModalVisible}
        onOk={handleAddTip}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: "#9d787f", borderColor: "#8f6f75" },
        }}
        cancelButtonProps={{ style: { borderColor: "#8f6f75" } }}
      >
        <Input
          placeholder="Title"
          value={newTip.title}
          onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
        />
        <TextArea
          rows={3}
          placeholder="Detail"
          value={newTip.detail}
          onChange={(e) => setNewTip({ ...newTip, detail: e.target.value })}
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default Tips;
