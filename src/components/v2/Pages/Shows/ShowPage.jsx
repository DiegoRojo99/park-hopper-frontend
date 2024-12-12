import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { useAuth } from '../../../../contexts/AuthContext';
import Calendar from '../../Extras/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Shows.css'
import { Status } from '../../../common/Status';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { formatShowtime } from '../../../pageDetails/showHelper';

export function ShowPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [liveData, setLiveData] = useState(null);
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
        if (!response.ok || !scheduleRes.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        setLiveData(result.liveData?.[0]);
        
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

    fetchData();
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

  function renderShow(){
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
        <div className='show-details-info'>
        
          <div className="show-details-row">
            <div className="show-details-left">
              {/* <img src={""} alt="icon" className="show-details-icon" /> */}
              <span className="show-details-text-light">
                Status:
              </span>
            </div>
            <div className="show-details-right">
              <span className="show-details-text">
                <Status status={liveData.status} />
              </span>
            </div>
          </div>
         
          {
            liveData.showtimes?.length ? 
              <>      
                <div className="show-details-row">
                  <div className="show-details-left">
                    {/* <img src={""} alt="icon" className="show-details-icon" /> */}
                    <span className="show-details-text-light">
                      Showtimes:
                    </span>
                  </div>
                  <div className="show-details-right">
                    {liveData.showtimes.map((show, index) => {
                      return (
                        <span className="show-details-text">
                          {formatShowtime(show.startTime, show.endTime, timezone)}
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
      {!showCalendar ? renderShow() : renderCalendar()}
    </div>
  );
};