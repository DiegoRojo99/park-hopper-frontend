import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <div className="nav-menu">
      <Link className='nav-logo' to='/'>Park Hopper</Link>
      <div></div>
      <ul className="nav-menu-content">
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/favs">Favs</Link></li>
        <li><Link to="/login">Login/Logout</Link></li>
      </ul>
    </div>
  );
}

export default Nav;
