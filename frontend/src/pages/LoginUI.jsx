import { useState } from "react";
import { login } from "../Api";
import "./LoginUI.css";

export default function LoginUI() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ username, password });
      console.log("Login successful:", response.data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      alert("Login successful!");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <main className="main-content">
        <div className="form-container">
          <h2 className="welcome-title">Welcome!</h2>
          <p className="welcome-text">Login or create a free account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="sign-in-btn">Sign In</button>
            <a href="#" className="forgot-link">Forgot password?</a>
          </form>

          <button className="create-account-btn">Create Account</button>
        </div>
      </main>
    </div>
  );
}
