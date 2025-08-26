import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Nav: React.FC = () => {
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-light-secondary dark:bg-dark-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:underline">Park Hopper</Link>
        </h1>
        <div className="space-x-4">
          {/* <Link to="/" className="hover:underline">Home</Link> */}
          <Link to="/parks" className="hover:underline">Parks</Link>
          <Link to="/admin/images" className="hover:underline">Admin Images</Link>
          {/* <Link to="/sync" className="hover:underline">Sync Parks</Link> */}
          
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
    </nav>
  );
};

export default Nav;