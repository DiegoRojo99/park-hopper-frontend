import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBookmark, faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';
import { faCompass, faStar } from '@fortawesome/free-regular-svg-icons';
import UserProfile from '../v2/User/UserProfile';
import Search from '../v2/Extras/Search/Search';

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  function handleSearchIconClick() {
    setSearchOpen((prev) => !prev);
  }
  
  function closeSearchBar(){
    setSearchOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(false);
        setSearchOpen(false); // Close search if clicked outside
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
      <p className={searchOpen ? 'short-nav-logo' : "nav-logo"}>
        Park Hopper
      </p>
      <div className={openMenu ? 'menu-items open' : 'menu-items'}>
        <NavItem link="/" name="Home" icon={faHouse} />
        <NavItem link="/explore" name="Explore" icon={faCompass} />
        <NavItem link="/favorites" name="Favorites" icon={faStar} />
        <NavItem link="/bookmarks" name="Bookmarks" icon={faBookmark} />
      </div>

      { searchOpen ? <Search closeSearchBar={closeSearchBar} /> : <div className="nav-space"></div> }

      <div className="option-icons">
        <FontAwesomeIcon
          className="util-icon"
          icon={faSearch}
          style={{ color: 'white' }}
          onClick={handleSearchIconClick}
        />
        {/* <Link to="/favorites">
          <FontAwesomeIcon className="util-icon" icon={faStar} style={{ color: 'white' }} />
        </Link> */}
      </div>
      <UserProfile className="user-profile-icon" closeMenu={() => setOpenMenu(false)} />
    </div>
  );
}

export default Nav;
