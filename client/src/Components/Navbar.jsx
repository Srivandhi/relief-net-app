
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

export const Navbar = () => {
  const navigate = useNavigate();
  
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
 
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ReliefNet
        </Link>
        
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              {/* V-- ADD THE 'logout' CLASS HERE --V */}
              <button onClick={handleLogout} className="nav-button logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-button">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};