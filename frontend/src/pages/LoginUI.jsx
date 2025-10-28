import { useState } from "react";
import './LoginUI.css';

const LoginUI = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", username, password);
    // connect backend later
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
          />

          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginUI;
