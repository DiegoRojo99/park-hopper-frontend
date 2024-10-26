import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGear } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';
import { faCompass, faStar, faUser } from '@fortawesome/free-regular-svg-icons';
import UserProfile from '../v2/User/UserProfile';

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
  const navRef = useRef(null);

  function handleLinkClick() {
    setOpenMenu(false);
  }

  function NavItem({ link, name, icon }) {
    return (
      <Link to={link} onClick={handleLinkClick}>
        {openMenu ? <FontAwesomeIcon icon={icon} className="nav-icon" /> : null}
        <span>{name}</span>
      </Link>
    );
  }

  const toggleMenu = () => setOpenMenu((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-menu" ref={navRef}>
      <a id="hamburger-icon" className={openMenu ? 'clicked icon' : 'icon'} onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </a>
      <Link className="nav-logo" to="/" onClick={handleLinkClick}>
        Park Hopper
      </Link>
      <div className={openMenu ? 'menu-items open' : 'menu-items'}>
        <NavItem link="/explore" name="Explore" icon={faCompass} />
        <NavItem link="/favs" name="Favorites" icon={faStar} />
      </div>
      <UserProfile className="user-profile-icon" closeMenu={() => setOpenMenu(false)} />
    </div>
  );
}

export default Nav;
