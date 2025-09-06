import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./SavedOutfits.css";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SavedOutfits() {
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);

      fetch(`/api/main/get-saved-outfits/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setSavedOutfits(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading saved outfits:", err);
          toast.error("Failed to load saved outfits.");
          setLoading(false);
        });
    }
  }, []);

  const renderImage = (filename, description) => {
    if (!filename) return null;
    const src = loginUser.gender === "F" ? `/images/${filename}` : filename;
    return <img src={src} alt={description} />;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this outfit?")) return;

    try {
      const response = await fetch(`/api/main/delete-outfit/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedOutfits((prevOutfits) =>
          prevOutfits.filter((outfit) => outfit._id !== id)
        );
        toast.success("Outfit deleted successfully!");
      } else {
        console.error("Failed to delete outfit");
        toast.error("Failed to delete outfit.");
      }
    } catch (error) {
      console.error("Error deleting outfit:", error);
      toast.error("An error occurred while deleting the outfit.");
    }
  };

  return (
    <div className="saved-outfits-container">
      <Navbar />

      <h2>Saved Outfits</h2>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <p>Loading your saved outfits...</p>
        </div>
      ) : savedOutfits.length > 0 ? (
        savedOutfits.map((outfit, index) => (
          <div className="outfit-set" key={outfit._id}>
            <div className="outfit-header">
              <h3>Outfit {index + 1}</h3>
              <button
                className="delete-btn"
                onClick={() => handleDelete(outfit._id)}
              >
                ×
              </button>
            </div>

            <div className="outfit-images">
              {renderImage(outfit.img1_filename, outfit.img1_description)}
              {renderImage(outfit.img2_filename, outfit.img2_description)}
              {renderImage(outfit.img3_filename, outfit.img3_description)}
            </div>

            <div className="outfit-descriptions">
              {outfit.img1_description && <p>{outfit.img1_description}</p>}
              {outfit.img2_description && <p>{outfit.img2_description}</p>}
              {outfit.img3_description && <p>{outfit.img3_description}</p>}
            </div>
          </div>
        ))
      ) : (
        <p className="empty-state">
          No outfit suggestions yet. Go save your favorite looks!
        </p>
      )}

      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
}
