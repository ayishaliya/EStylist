import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/Spinner";

import "./Registration.css";

const Stylist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bodyType: "",
    preferredSize: "",
    password: "",
    confirm_password: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User Created Successfully:", result);
        message.success("Registration successful!");
        navigate("/login");
      } else {
        const errData = await response.json();
        console.log("Error in creating User:", errData);
        setError(errData.error || "Failed to Create User");
      }
    } catch (err) {
      console.log("Network Error", err);
      setError("Network Error: Failed to reach server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/main");
    }
  }, [navigate]);

  return (
    <div className="registration-body">
      <div className="registration-container">
        <h2 className="registration-header">User Registration</h2>
        {error && <div className="error-msg">{error}</div>}{" "}
        {loading && <Spinner />}
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="registration-form-group">
            <label className="registration-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="registration-input"
            />
          </div>

          <div className="registration-row-fields">
            <div className="registration-form-group">
              <label className="registration-label">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="registration-input"
              />
            </div>
            <div className="registration-form-group">
              <label className="registration-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="registration-select"
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          <div className="registration-form-group">
            <label className="registration-label">Body Type</label>
            <select
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
              className="registration-select"
            >
              <option value="">Select Body Type</option>
              <option value="hourglass">Hourglass</option>
              <option value="rectangle">Rectangle</option>
              <option value="invertedtriangle">Inverted Triangle</option>
              <option value="pear">Pear</option>
            </select>
            <Link to="/bodytype">
              <label className="registration-label">Find your body type</label>
            </Link>
          </div>
          <div className="registration-form-group">
            <label className="registration-label">Preferred Size</label>
            <select
              name="preferredSize"
              value={formData.preferredSize}
              onChange={handleChange}
              required
              className="registration-select"
            >
              <option value="">Select Preferred Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div className="registration-form-group">
            <label className="registration-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="registration-input"
            />
          </div>

          <div className="registration-form-group">
            <label className="registration-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="registration-input"
            />
          </div>

          <div className="registration-form-group">
            <label className="registration-label">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="registration-input"
            />
          </div>

          <div className="registration-submit-container">
            <button
              type="submit"
              className="registration-submit-button"
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Stylist;
