import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setFormData(data);
      })
      .catch(() => alert("Error fetching user data"));
  }, [id]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        setIsEditing(false);
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const allowedFields = {
    name: "Name",
    age: "Age",
    gender: "Gender",
    bodyType: "Body Type",
    preferredSize: "Preferred Size",
    email: "Email",
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-header">My Account</h2>
        <div className="profile-section">
          <div className="profile-pic">
            {userData.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="profile-details">
            {Object.entries(allowedFields).map(([key, label]) => (
              <div className="detail-row" key={key}>
                <span>{label}</span>
                {isEditing ? (
                  key === "gender" ? (
                    <select
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  ) : key === "bodyType" ? (
                    <select
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                    >
                      <option value="hourglass">Hourglass</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="invertedtriangle">
                        Inverted Triangle
                      </option>
                      <option value="pear">Pear</option>
                    </select>
                  ) : key === "preferredSize" ? (
                    <select
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                    />
                  )
                ) : (
                  <span>{userData[key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          {isEditing ? (
            <button className="profile-save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="options-container">
        <div
          className="option"
          onClick={() => navigate(`/resetpassword/${id}`)}
        >
          Change Password
        </div>
        <div className="option" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
