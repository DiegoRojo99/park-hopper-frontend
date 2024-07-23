import React from 'react';

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

  return (
    <div className='waiting-times'>
      <div className='attraction-row header-row'>
        <p>Attraction</p>
        <p>Waiting Time</p>
        <p>Status</p>
      </div>
      { attractions.sort((a,b) => sortByWaitTime(a, b)).map((a) => {
        return (
          <div className='attraction-row'>
            <p>{a.name}</p>
            <p>{a.queue?.STANDBY?.waitTime ? a.queue["STANDBY"].waitTime : "-"}</p>
            <p>{a.status}</p>
          </div>
        )
      })}
    </div>
  );
};