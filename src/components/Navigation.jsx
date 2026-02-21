import { Link, useLocation } from 'react-router-dom';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const { getUserSavedArticles } = useArticles();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    Navigate('/');
  };

  return (
    <nav>
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 className="nav-brand">NewsReader</h1>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
            >
              Search
            </Link>
            {/* ⚠️ SECURITY ISSUE: No authentication required to access saved articles */}
            <Link 
              to="/saved" 
              className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}
            >
              Saved Articles ({getUserSavedArticles().length})
            </Link>
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link
              to='/admin'
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Admin
            </Link>
          </div>
        </div>
        {/* ⚠️ SECURITY ISSUE: No login/logout functionality */}
        <div className="nav-user">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username">{user.username}</span>
              {user.role === 'admin' && (
                <span className='admin-badge'>Admin</span>
              )}
              <button onClick={handleLogout} className='logout-button'>
                Logout
              </button>
            </div>
          ) : (
            <Link to='/login' className='login-link'>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;