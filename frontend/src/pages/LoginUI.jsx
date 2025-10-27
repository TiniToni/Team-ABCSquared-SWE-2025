import { useState } from "react";
import './LoginUI.css';
import { login } from "../Api";

const LoginUI = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await login({ username, password });
      setResponse(res.data);
      console.log("Login success:", res.data);

      // store JWT tokens in localStorage
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="left-half">
        {/* future image would go here */}
      </div>

      <div className="right-half">
        <div className="login-heading">
          <h2>Welcome!</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username:</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>

        {response && (
          <div style={{ marginTop: "1rem", color: "green" }}>
            Logged in successfully! <br />
            Access Token: {response.access.substring(0, 20)}...
          </div>
        )}

        {error && (
          <div style={{ marginTop: "1rem", color: "red" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginUI;
