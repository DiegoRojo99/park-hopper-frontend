import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faTriangleExclamation, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as lineStar } from '@fortawesome/free-regular-svg-icons';
import './Utils.css';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';
import { Status } from './../common/Status';

export function WaitingTimes({ attractions , favorites}){
  
  const [userAttractions, setUserAttractions] = useState(favorites);
  const { user } = useAuth(); 
  const apiUrl = process.env.REACT_APP_API_URL;

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

  function statusData(status){
    switch(status){
      case "OPERATING":
        return (
          <div className='status-div'>
            <p>OPEN</p>
            <FontAwesomeIcon icon={faCheck} style={{color: "#197328", margin: '0 4px'}} />
          </div>
        );
      case "REFURBISHMENT":
      case "CLOSED":
        return (
          <div className='status-div'>
            <p>CLOSED</p>
            <FontAwesomeIcon icon={faX} style={{color: "#f00", margin: '0 4px'}} />
          </div>
        );
      case "DOWN":
        return (
          <div className='status-div'>
            <p>DOWN</p>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#fcb00a", margin: '0 4px'}} />
          </div>
        );
      default:
        return <p>{status}</p>
    }  
  }

  async function selectFavAttraction(attraction, fav){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    if(!fav){
      const body = {
        "entityId": attraction.id,
        "type": "ATTRACTION",
        "name": attraction.name
      }
  
      try {
        const response = await fetch(`${apiUrl}/addFavorite`, { 
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

      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    } 
    else{
      const body = {
        "entityId": attraction.id ?? attraction.EntityID,
        "type": "attraction"
      }
  
      try {
        const response = await fetch(`${apiUrl}/removeFavorite`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // loadUserFavorites();
      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    }  
    
  }

  return (
    <div className='waiting-times'>
      <div className='attraction-row header-row'>
        <p></p>
        <p>Attraction</p>
        <p>Waiting Time</p>
        <p>Status</p>
      </div>
      { attractions.sort((a,b) => sortByWaitTime(a, b)).map((att) => {
        const fav = userAttractions ? userAttractions.some(userAtt => userAtt.EntityID === att.id || userAtt.EntityID === att.EntityID) : false;
        const waitingTime = att?.WaitTime ? att.WaitTime : att.queue?.STANDBY?.waitTime ? att.queue["STANDBY"].waitTime : "-";
        return (
          <div className='attraction-row'> 
            <FontAwesomeIcon 
              icon={!fav ? lineStar : solidStar} 
              className='star-icon' 
              onClick={() => selectFavAttraction(att, fav)} 
            />
            <p>{att.name}</p>
            <p>{waitingTime}</p>
            <Status status={att.status} />
          </div>
        )
      })}
    </div>
  );
};