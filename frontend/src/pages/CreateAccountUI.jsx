import { useState } from "react";
import { registerUser } from "../Api";
import "./CreateAccountUI.css";

export default function RegisterUI() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser({ username, password });
      console.log("Registration successful:", response.data);

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        const msg =
          err.response.data.username?.[0] ||
          err.response.data.password?.[0] ||
          "Registration failed";
        setError(msg);
      } else {
        setError("Unable to register. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">
      <main className="main-content">
        <div className="form-container">
          <h2 className="welcome-title">Create Your Account</h2>
          <p className="welcome-text">Join ChefTamer today!</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <button type="submit" className="sign-up-btn">
              Create Account
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </main>
    </div>
  );
}