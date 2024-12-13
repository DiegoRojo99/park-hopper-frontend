import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { useAuth } from '../../../../contexts/AuthContext';
import Calendar from '../../Extras/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Restaurants.css'
import { Status } from '../../../common/Status';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import AlarmIcon from './../../../../img/bell.png';
import FullAlarmIcon from './../../../../img/fullBell.png';

export function RestaurantPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [liveData, setLiveData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [timezone, setTimezone] = useState(false);
  const [schedule, setSchedule] = useState(null);;
  const [showCalendar, setShowCalendar] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const { user } = useAuth(); 

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`);
        const scheduleRes = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/schedule`);
        const restaurantRequest = await fetch(`${apiUrl}/restaurants/id/${id}`);
        if (!response.ok || !scheduleRes.ok || !restaurantRequest.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        const restaurantObject = await restaurantRequest.json();

        if(!restaurantObject){
          throw new Error('Data is empty');
        }
        setRestaurantData(restaurantObject);
        setLiveData(result.liveData?.[0]);
        setTimezone(scheduleObj.timezone)
        setSchedule(groupSchedule(scheduleObj.schedule));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    // async function loadUserFavorites(){
    //   try {
    //     const result = await fetch(`${apiUrl}/favorites`, { 
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${user.accessToken}`
    //       }
    //     })
    //     .then((response) => {
    //       if (response.ok) {
    //         return response.json();
    //       }
    //       else if(response.status === "401"){
    //         throw new Error('Not logged in');
    //       }
    //       throw new Error('Something went wrong');
    //     });
        
    //     setUserRestaurants(result);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }

    fetchData();
    // loadUserFavorites();
  }, [id]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderCalendar(){
    if(loading){
      return <></>
    }
    return <Calendar schedule={schedule} timezone={timezone} />
  }

  function renderRestaurant(){
    return (
      <>
        <div className='waiting-time-circle-div'>
          {/* 
          <div className='waiting-time-circle'>
            <span className='circle-waiting-time'>
              {liveData?.queue?.STANDBY?.waitTime ?? "-"}
            </span>
            <span className='circle-minutes'>
              Minutes
            </span>
          </div> 
          */}
        </div>
        <div className='restaurant-details-info'>
        {/* 
          <div className="restaurant-details-row">
            <div className="restaurant-details-left">
              <img src={""} alt="icon" className="restaurant-details-icon" />
              <span className="restaurant-details-text-light">
                Status:
              </span>
            </div>
            <div className="restaurant-details-right">
              <span className="restaurant-details-text">
                <Status status={liveData.status} />
              </span>
            </div>
          </div>
          */}
          { restaurantData.ParentEntity === "Park" ?
            <div className="restaurant-details-row">
              <div className="restaurant-details-left">
                {/* <img src={""} alt="icon" className="restaurant-details-icon" /> */}
                <span className="restaurant-details-text-light">
                  Park:
                </span>
              </div>
              <div className="restaurant-details-right">
                <span className={"restaurant-details-text div-clickable"} onClick={() => openLink(restaurantData.ParentID)}>
                  {restaurantData.ParentName}
                </span>
              </div>
            </div> 
          :
            <div className="restaurant-details-row">
            <div className="restaurant-details-left">
              {/* <img src={""} alt="icon" className="restaurant-details-icon" /> */}
              <span className="restaurant-details-text-light">
                Destination:
              </span>
            </div>
            <div className="restaurant-details-right">
              <span className={"restaurant-details-text div-clickable"}>
                {restaurantData.ParentName}
              </span>
            </div>
          </div>
          }
          {
            restaurantData.Cuisines && restaurantData.Cuisines !== "null" ? 
              <>      
                <div className="restaurant-details-row">
                  <div className="restaurant-details-left">
                    {/* <img src={""} alt="icon" className="restaurant-details-icon" /> */}
                    <span className="restaurant-details-text-light">
                      Cuisines:
                    </span>
                  </div>
                  <div className="restaurant-details-right">
                    {restaurantData.Cuisines.split(",").map((cuisine, index) => {
                      return (
                        <span className="restaurant-details-text">
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
  
  if(loading || !restaurantData){
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
          <span>{restaurantData.Name}</span>
          {/* <FontAwesomeIcon icon={showCalendar ? faCalendarXmark : faCalendar} className='calendar-icon' onClick={() => setShowCalendar(!showCalendar)} /> */}
        </h1>
      </div>
      {!showCalendar ? renderRestaurant() : renderCalendar()}
    </div>
  );
};