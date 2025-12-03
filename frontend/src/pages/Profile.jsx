import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    //removing the login token
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/");
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <p>Profile details will go here.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
