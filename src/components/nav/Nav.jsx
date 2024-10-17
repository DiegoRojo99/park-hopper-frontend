import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);

  function handleLinkClick(){
    setOpenMenu(false);
  }

  return (
    <div className="nav-menu">
      <a id="hamburger-icon" className={openMenu ? 'clicked icon' : 'icon'} onClick={() => setOpenMenu(!openMenu)}>
        <FontAwesomeIcon icon={faBars} />
      </a>
      <Link className='nav-logo' to='/'  onClick={handleLinkClick}>Park Hopper</Link>
      <div className={openMenu ? "menu-items open" : "menu-items"}>
        <Link to="/explore" onClick={handleLinkClick}>Explore</Link>
        <Link to="/favs" onClick={handleLinkClick}>Favs</Link>
        {/* <Link to="/settings" onClick={handleLinkClick}>Settings</Link> */}
        <Link to="/login" onClick={handleLinkClick}>Login/Logout</Link>     
      </div>
    </div>
  );
}

export default Nav;
