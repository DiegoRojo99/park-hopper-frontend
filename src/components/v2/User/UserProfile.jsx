import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './User.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faArrowRightToBracket, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

function UserProfile({closeMenu}) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  function toggleDropdown(){
    closeMenu();
    setDropdownOpen((prev) => !prev);
  };

  function closeDropdown(){
    setDropdownOpen(false);
  }
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function UserProfileLink({ link, name, icon }) {
    return (
      <Link to={link} onClick={closeDropdown}>
        <FontAwesomeIcon icon={icon} className="nav-icon" />
        <span>{name}</span>
      </Link>
    );
  }

  function userDefaultIcon(){
    return <FontAwesomeIcon icon={faCircleUser} className="profile-icon" style={{color: '#fff'}} />
  }

  function loggedInUser(){
    return (
      <>
      {user.photoURL ?
        <img
          src={user.photoURL}
          alt="User Profile"
          className="profile-icon"
        /> 
      : 
        userDefaultIcon()
      }
      
      {dropdownOpen && (
        <div className="dropdown-menu">
          <UserProfileLink link={'/settings'} icon={faGear} name={"Settings"} />
          <UserProfileLink link={'/'} icon={faArrowRightFromBracket} name={"Log Out"} />
        </div>
      )}
      </>
    )
  }
  
  function withoutUser(){
    return (
      <>
      {userDefaultIcon()}
      {dropdownOpen && (
        <div className="dropdown-menu">
          <UserProfileLink link={'/login'} icon={faArrowRightToBracket} name={"Log In"} />
        </div>
      )}
      </>
    )
  }

  return (
    <div className="user-profile" ref={dropdownRef}>
        <div onClick={toggleDropdown}>
        {user ? loggedInUser() : withoutUser() }
        </div>
    </div>
  );
}

export default UserProfile;