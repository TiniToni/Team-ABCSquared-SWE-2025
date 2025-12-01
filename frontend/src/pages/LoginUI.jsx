import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Api";
import "./LoginUI.css"; 

export default function LoginUI() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await login({ username, password });
      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setSuccess("Login successful!");
        setTimeout(() => navigate("/dashboard"), 900);
      } else {
        setError("Login failed");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="ct-login-page">
      <div className="ct-login-box">
        <h2 className="ct-login-heading">Welcome!</h2>
        <p className="ct-login-subtext">Sign in to continue</p>

        <form className="ct-login-form" onSubmit={handleSubmit}>
          <label className="ct-label">Username</label>
          <input
            className="ct-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="ct-label">Password</label>
          <input
            className="ct-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="ct-error">{error}</div>}
          {success && <div className="ct-success">{success}</div>}

          <button className="ct-button ct-login-btn" type="submit">
            Log In
          </button>
        </form>

        <div className="ct-create-section">
          <p className="ct-create-text">Don't have an account?</p>
          <button
            className="ct-button ct-create-btn"
            onClick={() => navigate("/register")}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}




