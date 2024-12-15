import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as lineBookmark } from '@fortawesome/free-regular-svg-icons';
import AlarmIcon from './../../img/bell.png';
import FullAlarmIcon from './../../img/fullBell.png';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';
import { Status } from '../common/Status';
import AlertModal from '../v2/Extras/AlertModal';
import './Details.css';
import './Utils.css';
import { useNavigate } from 'react-router-dom';

export function ReducedWaitingTimes({ attractions, bookmarks}){

  const [ userBookmarks, setUserBookmarks] = useState(bookmarks);
  const [ userAlerts, setUserAlerts] = useState(false);
  const [ showModal, setShowModal] = useState(false);
  const { user } = useAuth(); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setUserBookmarks(bookmarks);
  }, [bookmarks])

  if (!attractions) {
    return <Loader />;
  }
  else if(!attractions.length){
    return <p>No matching attractions</p>
  }

  function sortByWaitTime(a, b){
    const aWaitTime = a.WaitTime ?? a.queue?.STANDBY?.waitTime;
    const bWaitTime = b.WaitTime ?? b.queue?.STANDBY?.waitTime;
    if(!aWaitTime && bWaitTime){
      return 1;
    }
    else if (!bWaitTime && aWaitTime){
      return -1;
    }
    else if(!aWaitTime && !bWaitTime){
      if(a.status === b.status){
        return 0;
      }
      else if(a.status === "CLOSED"){
        return 1;
      }
      else if(a.status === "OPERATING"){
        return -1;
      }
      else if(b.status === "CLOSED"){
        return -1;
      }
      else if(b.status === "OPERATING"){
        return 1;
      }
    }
    else{
      return bWaitTime - aWaitTime;
    }
  }

  async function bookmarkAttraction(attraction, bookmarked){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    const body = {
      "entityId": attraction.id ?? attraction.EntityID,
    };

    const method = bookmarked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`${apiUrl}/bookmarks`, {
          method,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } 
    catch (error) {
      console.error(`Failed to ${bookmarked ? 'remove' : 'add'} favorite:`, error);
    } 
    finally {
      addBookmark(attraction, bookmarked);
    }
    
  }
  
  async function showAlertModal(attraction, alert){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    setShowModal(attraction);
  }

  function hideAlertModal() {
    setShowModal(false);
  }

  function handleSetAlert(attraction, time) {
    setAlertTime(attraction, time);
  }

  async function setAlertTime(attraction, time){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    const body = {
      "attractionId": attraction.id,
      "time": time
    }
  
    try {
      const response = await fetch(`${apiUrl}/setWaitTimeAlert`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      alert(`Alert set for ${attraction.name} for waiting time less than ${time} minutes!`);

    } catch (error) {
      console.error('Failed to add favorite:', error);
    }    
  }

  function addBookmark(att, bookmarked){
    let newBookmarks = !bookmarked ? [...bookmarks, att] : bookmarks.filter(b => b.id !== att.id);
    setUserBookmarks(newBookmarks);
  }

  function openLink(id) {
    const url = `/attractions/${id}`;
    navigate(url); 
  }


  return (
    <div className='waiting-times'>
      <div className='reduced-row header-row'>
        <p></p>
        <p>Attraction</p>
        <p>Time</p>
        <p>Status</p>
      </div>
      { attractions.sort((a,b) => sortByWaitTime(a, b)).map((att) => {
        const booked = userBookmarks.some(userAtt => userAtt.id === att.id);
        const alert = userAlerts ? userAlerts.some(userAtt => userAtt.id === att.id || userAtt.id === att.EntityID) : false;
        const liveData = att.liveData;
        const waitingTime = liveData?.queue?.STANDBY?.waitTime ?? "-";
        return (
          <div className='reduced-row'> 
            <div>
              <FontAwesomeIcon 
                icon={!booked ? lineBookmark : solidBookmark} 
                className='star-icon' 
                onClick={() => bookmarkAttraction(att, booked)} 
              />
              <img 
                alt="Alarm" 
                src={alert ? FullAlarmIcon : AlarmIcon} 
                className='alarm-icon'
                onClick={() => showAlertModal(att, alert)} 
              />
            </div>
            <p className={openLink ? 'div-clickable' : ''} onClick={openLink ? () => openLink(att.id) : null}>{att.name}</p>
            <p>{waitingTime}</p>
            <Status status={liveData?.status} />
          </div>
        )
      })}
      <AlertModal
        show={showModal}
        onClose={hideAlertModal}
        onSetAlert={handleSetAlert}
      />
    </div>
  );
};