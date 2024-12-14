import { faMap } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openGoogleMaps } from "../../../../functions/externalLinks";
import './Restaurants.css';
import { useNavigate } from "react-router-dom";

export default function RestaurantList({restaurants}){
  return (
    <div className="restaurant-list">
      <div className='restaurant-row header-row'>
        <div>Restaurant Name</div>
        <div>Location</div>
      </div>
      {restaurants.map(r => RestaurantRow(r))}
    </div>
  )
};

function RestaurantRow(restaurant){
  
  const navigate = useNavigate();
  function openLink() {
    const url = `/restaurants/${restaurant.id}`;
    navigate(url); 
  }

  return (
    <div className="restaurant-row">
      <div onClick={openLink}>{restaurant.name}</div>
      <FontAwesomeIcon className="center-align" icon={faMap} onClick={() => openGoogleMaps(restaurant.location.latitude, restaurant.location.longitude)} />
    </div>
  )
}