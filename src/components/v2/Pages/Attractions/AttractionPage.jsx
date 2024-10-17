import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { useAuth } from '../../../../contexts/AuthContext';
import Calendar from '../../Extras/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Attractions.css'
import { Status } from '../../../common/Status';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import AlarmIcon from './../../../../img/bell.png';
import FullAlarmIcon from './../../../../img/fullBell.png';

export function AttractionPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [liveData, setLiveData] = useState(null);
  const [attractionData, setAttractionData] = useState(null);
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
        const attractionRequest = await fetch(`${apiUrl}/attractions/${id}`);
        if (!response.ok || !scheduleRes.ok || !attractionRequest.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        const attractionObject = await attractionRequest.json();

        if(!result?.liveData?.[0] || !attractionObject?.[0]){
          setError(true);
          setLoading(false);
        }
        setAttractionData(attractionObject[0]);
        setLiveData(result.liveData[0]);
        
        const groupedByDate = scheduleObj.schedule.reduce((acc, obj) => {
          const date = new Date(obj.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
          return acc;
        }, {});
        setTimezone(scheduleObj.timezone)
        setSchedule(groupedByDate);
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
        
    //     setUserAttractions(result);
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

  function renderAttraction(){
    return (
      <>
        <div className='waiting-time-circle-div'>
          <div className='waiting-time-circle'>
            <span className='circle-waiting-time'>
              {liveData?.queue?.STANDBY?.waitTime ?? "-"}
            </span>
            <span className='circle-minutes'>
              Minutes
            </span>
          </div>
        </div>
        <div className='attraction-details-info'>
          <div className="attraction-details-row">
            <div className="attraction-details-left">
              {/* <img src={""} alt="icon" className="attraction-details-icon" /> */}
              <span className="attraction-details-text-light">
                Status:
              </span>
            </div>
            <div className="attraction-details-right">
              <span className="attraction-details-text">
                <Status status={liveData.status} />
              </span>
            </div>
          </div>
          <div className="attraction-details-row">
            <div className="attraction-details-left">
              {/* <img src={""} alt="icon" className="attraction-details-icon" /> */}
              <span className="attraction-details-text-light">
                Park:
              </span>
            </div>
            <div className="attraction-details-right">
              <span
                className={attractionData.ParkID ? "attraction-details-text div-clickable" : "attraction-details-text"}
                onClick={attractionData.ParkID ? () => openLink(attractionData.ParkID) : null}>
                {attractionData.ParkName}
              </span>
            </div>
          </div>
          <div className="attraction-details-row">
            <div className="attraction-details-left">
              {/* <img src={""} alt="icon" className="attraction-details-icon" /> */}
              <span className="attraction-details-text-light">
                Zone:
              </span>
            </div>
            <div className="attraction-details-right">
              <span className="attraction-details-text">
                {attractionData.ZoneName}
              </span>
            </div>
          </div>
          <div className="attraction-details-row">
            <div className="attraction-details-left">
              {/* <img src={""} alt="icon" className="attraction-details-icon" /> */}
              <span className="attraction-details-text-light">
                Destination:
              </span>
            </div>
            <div className="attraction-details-right">
              <span className="attraction-details-text">
                {attractionData.DestinationName}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  if(loading){
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
          <span>{liveData.name}</span>
          {/* <FontAwesomeIcon icon={showCalendar ? faCalendarXmark : faCalendar} className='calendar-icon' onClick={() => setShowCalendar(!showCalendar)} /> */}
        </h1>
      </div>
      {!showCalendar ? renderAttraction() : renderCalendar()}
    </div>
  );
};