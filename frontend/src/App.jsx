import { Routes, Route, Link } from 'react-router-dom';
import LoginUI from './pages/LoginUI';
import CreateAccountUI from "./pages/CreateAccountUI";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DashboardMain from './pages/DashboardMain';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import './App.css';

function App() {
  return (
    <>
      <div className='header-container'> 
        <h2 className='header-title'>ChefTamer!</h2>

        <nav className='navbar'>
          <div className='link-container'>
            {(() => {
              if (localStorage.getItem("access")) {
                return <Link to="/dashboard">Home</Link>;
              } else {
                return <Link to="/">Home</Link>;
              }
            })()}

            <Link to="/login">Login</Link>
          </div>

          <button
            className='user-icon'
            onClick={() => {
              if (localStorage.getItem("access")) {
                window.location.href = "/profile";
              } else {
                window.location.href = "/login";
              }
            }}
          ></button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginUI />} />
        <Route path="/register" element={<CreateAccountUI />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<DashboardMain />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
