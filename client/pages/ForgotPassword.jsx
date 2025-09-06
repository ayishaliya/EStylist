import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  // Request OTP
  const generateOTP = async () => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setShowOtpInput(true);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error sending OTP. Try again.");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      const response = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP Verified! Redirecting...");
        navigate(`/resetpassword/${data.userId}?from=forgot`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error verifying OTP.");
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <label>Email:</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={generateOTP}>Get OTP</button>

      {showOtpInput && (
        <div className="otp-container">
          <label>Enter OTP:</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
}
