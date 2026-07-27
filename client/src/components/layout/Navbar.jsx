import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, Bell, ChevronDown, User, LogOut, Settings, LayoutDashboard, Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <BookOpen size={22} />
          Skill<span>Sphere</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Explore
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Notification placeholder */}
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.4rem', borderRadius: '8px' }}
                title="Notifications (coming soon)"
              >
                <Bell size={18} />
              </button>

              {/* Avatar Dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.25rem 0.5rem', gap: '0.5rem' }}
                  onClick={() => setDropdownOpen((v) => !v)}
                  id="user-menu-button"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <Avatar user={user} size="sm" />
                  <span className="text-sm font-medium" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} style={{ opacity: 0.6, transition: 'transform 0.15s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu" role="menu">
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div className="font-semibold text-sm">{user?.name}</div>
                      <div className="text-xs text-muted">{user?.email}</div>
                    </div>

                    <Link
                      to={`/profile/${user?._id}`}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/explore"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Compass size={15} /> Explore
                    </Link>
                    <div className="dropdown-divider" />
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={15} /> Settings
                    </Link>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
