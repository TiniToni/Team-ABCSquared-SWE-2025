import { Routes, Route, Link } from 'react-router-dom';
import LoginUI from './pages/LoginUI';
import './App.css'

function App() {

  return (
    <>
      <div className='header-container'> 
        <h2 className='header-title'>ChefTamer!</h2>

        <nav className='navbar'>
          <div className='link-container'>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </div>

          <button className='user-icon'></button>
        </nav>

      </div>

      {/*routes*/}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<LoginUI />} />
      </Routes>
    </>
  )
}

export default App
