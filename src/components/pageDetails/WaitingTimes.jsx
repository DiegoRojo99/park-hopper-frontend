import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faTriangleExclamation, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as lineStar } from '@fortawesome/free-regular-svg-icons';
import './Utils.css';

export function WaitingTimes({ attractions }){

  if (!attractions) {
    return <p>Loading...</p>;
  }
  else if(!attractions.length){
    return <p>No matching attractions</p>
  }

  function sortByWaitTime(a, b){
    const aWaitTime = a.queue?.STANDBY?.waitTime;
    const bWaitTime = b.queue?.STANDBY?.waitTime;
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

  function selectFavAttraction(attractionName){
    
  }

  return (
    <div className='waiting-times'>
      <div className='attraction-row header-row'>
        <p></p>
        <p>Attraction</p>
        <p>Waiting Time</p>
        <p>Status</p>
      </div>
      { attractions.sort((a,b) => sortByWaitTime(a, b)).map((a) => {
        return (
          <div className='attraction-row'>            
            <FontAwesomeIcon icon={lineStar} className='star-icon' onClick={() => selectFavAttraction(a.name)} />
            <p>{a.name}</p>
            <p>{a.queue?.STANDBY?.waitTime ? a.queue["STANDBY"].waitTime : "-"}</p>
            {statusData(a.status)}
          </div>
        )
      })}
    </div>
  );
};