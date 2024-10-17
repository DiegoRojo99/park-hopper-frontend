import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGear } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';
import { faCompass, faStar, faUser } from '@fortawesome/free-regular-svg-icons';

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);

  function handleLinkClick(){
    setOpenMenu(false);
  }

  function NavItem({link, name, icon}){
    return (
      <Link to={link} onClick={handleLinkClick}>
        {openMenu ? <FontAwesomeIcon icon={icon} className='nav-icon' /> : <></>}
        <span>
          {name}
        </span>
      </Link>
    )
  }

  return (
    <div className="nav-menu">
      <a id="hamburger-icon" className={openMenu ? 'clicked icon' : 'icon'} onClick={() => setOpenMenu(!openMenu)}>
        <FontAwesomeIcon icon={faBars} />
      </a>
      <Link className='nav-logo' to='/'  onClick={handleLinkClick}>Park Hopper</Link>
      <div className={openMenu ? "menu-items open" : "menu-items"}>
        <NavItem link="/explore" name={"Explore"} icon={faCompass} />
        <NavItem link="/favs" name={"Favorites"} icon={faStar} />
        {/* <NavItem link="/settings" name={"Settings"} icon={faGear} /> */}
        <NavItem link="/login" name={"Login/Logout"} icon={faUser} /> 
      </div>
    </div>
  );
}


export default Nav;
