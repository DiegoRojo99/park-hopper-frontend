import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import './Restaurants.css'

export function RestaurantPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {

    const fetchData = async () => {

      try {
        const restaurantRequest = await fetch(`${apiUrl}/restaurants/details/${id}`);
        if (!restaurantRequest.ok) {
          throw new Error('Network response was not ok');
        }

        const restaurantObject = await restaurantRequest.json();
        if(!restaurantObject){
          throw new Error('Data is empty');
        }

        console.log("Restaurant: ", restaurantObject);
        setData(restaurantObject);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderRestaurant(){
    return (
      <>
        <div className='waiting-time-circle-div'>
        </div>
        <div className='restaurant-details-info'>
          {/* <div className="restaurant-details-row">
            <div className="restaurant-details-left">
              <span className="restaurant-details-text-light">
                Park:
              </span>
            </div>
            <div className="restaurant-details-right">
              <span className={"restaurant-details-text div-clickable"} onClick={() => openLink(data.parkId)}>
                {data.parkId}
              </span>
            </div>
          </div>  */}
          {
            data.cuisines.length ? 
              <>      
                <div className="restaurant-details-row">
                  <div className="restaurant-details-left">
                    {/* <img src={""} alt="icon" className="restaurant-details-icon" /> */}
                    <span className="restaurant-details-text-light">
                      Cuisines:
                    </span>
                  </div>
                  <div className="restaurant-details-right">
                    {data.cuisines.map((cuisine, index) => {
                      return (
                        <span key={cuisine} className="restaurant-details-text">
                          {cuisine}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </>
            : 
              <></> 
          }
        </div>
      </>
    )
  }
  
  if(loading || !data){
    return <Loader />;
  }
  return (
    <div className='details-page'>
      <div className='page-header'>
        <div className='page-icons'>
          {/* <FontAwesomeIcon icon={faStar} />
          <img src={AlarmIcon} style={{height: '26px', width: '28px'}} /> */}
        </div>
        <h1>
          <span>{data.name}</span>
          {/* <FontAwesomeIcon icon={showCalendar ? faCalendarXmark : faCalendar} className='calendar-icon' onClick={() => setShowCalendar(!showCalendar)} /> */}
        </h1>
      </div>
      {renderRestaurant()}
    </div>
  );
};