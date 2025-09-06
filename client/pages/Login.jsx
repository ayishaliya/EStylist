import React, { useState, useEffect } from "react";
import { UserRound, Lock, Eye, EyeOff } from "lucide-react";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/Spinner";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Both fields are required.");
      return;
    }

    const formData = { email, password };
    try {
      setLoading(true);
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User Logged in:", result);
        message.success("Login success!");

        // Set expiry
        const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...result.user,
            password: "",
            expiry: expirationTime,
          })
        );

        navigate("/main");
      } else {
        const errData = await response.json();
        setError(errData.error || "Failed to login");
      }
    } catch (error) {
      console.log("Network Error:", error);
      setError("Failed to reach server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const currentTime = Date.now();
      if (storedUser.expiry && currentTime > storedUser.expiry) {
        localStorage.removeItem("user"); // Remove expired session
        message.warning("Session expired, please log in again.");
        navigate("/login");
      } else {
        navigate("/main");
      }
    }
  }, [navigate]);

  const togglepassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="email">Email</label>{" "}
            <div className="login-inputbox-container">
              <UserRound className="login-inputbox-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="login-inputbox-container">
              <Lock className="login-inputbox-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
              <button type="button" onClick={togglepassword}>
                {showPassword ? (
                  <Eye className="login-inputbox-icon" />
                ) : (
                  <EyeOff className="login-inputbox-icon" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>

      {/* Show spinner when loading */}
      {loading && <Spinner />}

      <div className="forgotten-password">
        <Link
          to="/forgot-password"
          onClick={() => {
            localStorage.setItem("forgot", JSON.stringify(true));
          }}
        >
          Forgot password?
        </Link>
      </div>
      <div className="sign-up">
        <label>Not a registered user?</label>
        <Link to="/register">Register</Link>{" "}
      </div>
    </div>
  );
};

export default Login;
