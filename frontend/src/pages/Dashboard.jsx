import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-intro-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Welcome to ChefTamer!</h1>
        <p className="dashboard-subtitle">
          Watch cooking videos, take quizzes, and level up your virtual pet chef!
        </p>

        <button 
          className="dashboard-start-btn"
          onClick={() => navigate("/dashboard/main")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}


