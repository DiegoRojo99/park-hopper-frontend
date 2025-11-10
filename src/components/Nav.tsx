import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Nav: React.FC = () => {
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-light-secondary dark:bg-dark-secondary text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-xl font-bold">
            <Link to="/" className="hover:underline">Park Hopper</Link>
          </h1>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link to="/parks" className="hover:underline">Parks</Link>
            {user && <Link to="/bookmarks" className="hover:underline">Bookmarks</Link>}
            {user && <Link to="/alerts" className="hover:underline">Alerts</Link>}
            {userLoading ? null : user ? (
              <button
                onClick={handleLogout}
                className="hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit text-white"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } lg:hidden flex-col space-y-2 -mx-4 px-4 py-4 bg-gray-800 dark:bg-gray-700 border-t border-gray-700 dark:border-gray-600`}
        >
          <Link 
            to="/parks" 
            className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700/50 hover:text-white active:bg-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Parks
          </Link>
          {user && (
            <>
              <Link 
                to="/bookmarks" 
                className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700/50 hover:text-white active:bg-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bookmarks
              </Link>
              <Link 
                to="/alerts" 
                className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700/50 hover:text-white active:bg-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Alerts
              </Link>
            </>
          )}
          {userLoading ? null : user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700/50 hover:text-white active:bg-gray-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="block px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700/50 hover:text-white active:bg-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;