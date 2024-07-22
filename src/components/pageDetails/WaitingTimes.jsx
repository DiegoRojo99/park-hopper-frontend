import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function WaitingTimes({ type, attractions }){

  if (!attractions || !attractions.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>               
      <div className='waiting-times'>
        <div className='attraction-row header-row'>
            <p>Attraction</p>
            <p>Waiting Time</p>
            <p>Status</p>
        </div>
      {attractions.map((a) => {
        return (
          <div className='attraction-row'>
            <p>{a.name}</p>
            <p>{a.queue && a.queue["STANDBY"] && a.queue["STANDBY"].waitTime ? a.queue["STANDBY"].waitTime : "-"}</p>
            <p>{a.status}</p>
          </div>
        )
      })}
      </div>
    </div>
  );
};