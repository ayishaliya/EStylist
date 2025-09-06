import { useLocation, useNavigate, useParams } from "react-router-dom";
import { React, useState } from "react";
import { message } from "antd";
export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Check if reset is from forgot password
  const isForgotPasswordFlow =
    new URLSearchParams(location.search).get("from") === "forgot";

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...(isForgotPasswordFlow ? {} : { currentPassword }),
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Password reset successfully!");
        navigate("/login");
      } else {
        message.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      message.error("Network error, please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      {!isForgotPasswordFlow && (
        <>
          <label>Current Password:</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </>
      )}
      <label>New Password:</label>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <label>Confirm Password:</label>
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}
