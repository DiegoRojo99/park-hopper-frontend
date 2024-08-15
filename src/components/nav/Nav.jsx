import { Link } from 'react-router-dom';
import './Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className={openMenu ? "nav-menu responsive" : "nav-menu"}>
      <Link className='nav-logo' to='/'>Park Hopper</Link>
      <Link to="/login">Login/Logout</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/favs">Favs</Link>
      <Link to="/explore">Explore</Link>
      <a className='icon'>
        <FontAwesomeIcon icon={faBars} onClick={() => setOpenMenu(!openMenu)} />
      </a>
    </div>
  );
}

export default Nav;
