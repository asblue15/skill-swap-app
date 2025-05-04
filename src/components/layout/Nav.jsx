import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import logo from '../../assets/logo1.png';
import { useState, useEffect, useRef } from 'react';
import NotificationBell from '../shared/NotificationBell';

export default function Nav() {
  const { user, logout } = useUser();
  const nav = useNavigate();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);

  const handleLogout = () => {
    logout();
    nav('/');
    setDropDownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 bg-transparent backdrop-blur-xl shadow-xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center rtl:space-x-reverse">
          <img src={logo} className="h-20" alt="Skillswap Logo" />
          <h1 className="self-center font-semibold whitespace-nowrap dark:text-white">Skillswap</h1>
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
          {!user ? (
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </>
          ) : (
            <div className="flex items-center gap-2 relative" ref={dropDownRef}>
              <span className="text-black px-2">Hi, {user.name}</span>
              <img
                src={user.profilePicture || '/images/profiles/default-avt.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
                onClick={() => setDropDownOpen(!dropDownOpen)}
              />
              {dropDownOpen && (
                <div className="absolute top-full right-0 w-24 bg-white rounded-md shadow-lg z-50 flex flex-col text-left text-sm transition ease-out duration-150 transform origin-top scale-95">
                  <Link
                    to="/profile"
                    onClick={() => setDropDownOpen(false)}
                    className="px-4 py-2 hover:bg-pink-50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/connections"
                    onClick={() => setDropDownOpen(false)}
                    className="px-4 py-2 hover:bg-pink-50"
                  >
                    Setting
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-pink-700 font-semibold"
                  >
                    Logout
                  </div>
                </div>
              )}
              <NotificationBell />
            </div>
          )}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 hover:bg-pink-50 rounded ${isActive ? 'bg-pink-100 font-semibold' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/matches"
              className={({ isActive }) =>
                `px-4 py-2 hover:bg-pink-50 rounded ${isActive ? 'bg-pink-100 font-semibold' : ''}`
              }
            >
              My Matches
            </NavLink>
            <NavLink
              to="/connections"
              className={({ isActive }) =>
                `px-4 py-2 hover:bg-pink-50 rounded ${isActive ? 'bg-pink-100 font-semibold' : ''}`
              }
            >
              Connections
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `px-4 py-2 hover:bg-pink-50 rounded ${isActive ? 'bg-pink-100 font-semibold' : ''}`
              }
            >
              Contact Us
            </NavLink>
          </ul>
        </div>
      </div>
    </nav>
  );
}
