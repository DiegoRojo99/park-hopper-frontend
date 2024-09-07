import React, { useEffect, useState } from 'react';
import './Extras.css';

function AlertModal({ show, onClose, onSetAlert, alertTime = false }) {
  const [waitingTime, setWaitingTime] = useState(getWaitingTime())
  const [time, setTime] = useState(getInitialValue());

  function getWaitingTime(){
    if(!show){
      return 0;
    }
    else if(show?.WaitTime){
      return (show.WaitTime - 5);
    }
    else if(show?.queue?.STANDBY?.waitTime){
      return (show.queue.STANDBY.waitTime - 5);
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
      return getWaitingTime();
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
      alert("Waiting time is already below threshold time");
    }
  }

  useEffect(() => {
    if(show){
      setWaitingTime(getWaitingTime());
      setTime(getInitialValue());
    }
  }, [show])

  if (!show) return null;

  return (
    <div className="alert-modal-backdrop">
      <div className="alert-modal">
        <h2>{show.name}</h2>
        <h3>Set Waiting Time Alert</h3>
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
