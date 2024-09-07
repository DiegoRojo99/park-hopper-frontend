import React, { useEffect, useState } from 'react';
import './Extras.css';

function AlertModal({ show, onClose, onSetAlert, alertTime = false }) {
  const [waitingTime, setWaitingTime] = useState(getWaitingTime())
  const [time, setTime] = useState(getInitialValue());
  
  useEffect(() => {
    if(show){
      setWaitingTime(getWaitingTime());
      setTime(getInitialValue());
    }
  }, [show])

  function getWaitingTime(){
    if(!show){
      return 0;
    }
    else if(show?.WaitTime){
      return (show.WaitTime);
    }
    else if(show?.queue?.STANDBY?.waitTime){
      return (show.queue.STANDBY.waitTime);
    }
  }

  function getInitialValue(){
    if(alertTime){
      return alertTime;
    }
    else if(!show){
      return 5;
    }
    else {
      return getWaitingTime() - 5;
    }
  }

  function handleSetAlert() {
    if (time && time > 0 && time < waitingTime) {
      onSetAlert(show, time);
      onClose();
    }
    else if(!time){
      alert("Submit a time threshold");
    }
    else if(time <= 0){
      alert("Submit a positive time threshold");
    }
    else if(time >= waitingTime){
      alert(`Waiting time (${waitingTime}min) is already below threshold time (${time}min)`);
    }
  }

  function handleModalClick(event) {
    event.stopPropagation();
  }

  if (!show) return null;

  return (
    <div className="alert-modal-backdrop" onClick={onClose}>
      <div className="alert-modal" onClick={handleModalClick}>
        <h1>{show.name}</h1>
        {/* <h3>Set Waiting Time Alert</h3> */}
        <label htmlFor="waitTime">Alert me when wait time is less than:</label>
        <input
          type="number"
          id="waitTime"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter minutes"
        />
        <div className="alert-modal-buttons">
          <button onClick={handleSetAlert}>Set Alert</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
