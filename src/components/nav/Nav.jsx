import './Nav.css';

function Nav() {
  return (
    <div class="nav-menu">
      <a className='nav-logo' href='/'>Park Hopper</a>
      <div></div>
      <ul class="nav-menu-content">
        <li><a href="/explore">Explore</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/favs">Favs</a></li>
        <li><a href="/login">Login/Logout</a></li>
        {/* <li><a href="/explore"><span class="material-symbols-outlined">explore</span></a></li> */}
        {/* <li><a href="#"><span class="material-symbols-outlined">settings</span></a></li>
        <li style={{float: 'right'}}><a href="/login"><span class="material-symbols-outlined">login</span></a></li>  */}
      </ul>
    </div>
  );
}

export default Nav;
