import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { useAuth } from '../../../../contexts/AuthContext';
import { Status } from '../../../common/Status';
import './Attractions.css'

export function AttractionPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [attractionData, setAttractionData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const { user } = useAuth(); 

  useEffect(() => {

    const fetchData = async () => {
      try {
        const attractionResponse = await fetch(`${apiUrl}/attractions/${id}`);
        if (!attractionResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await attractionResponse.json();
        setAttractionData(result);
        setLoading(false);
      } 
      catch (error) {
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
  
  if(loading){
    return <Loader />;
  }
  return (
    <div className='details-page'>
      <div className='page-header'>
        <div className='page-icons'>
        </div>
        <h1>
          <span>{attractionData.name}</span>
        </h1>
      </div>
      <div className='waiting-time-circle-div'>
        <div className='waiting-time-circle'>
          <span className='circle-waiting-time'>
            {attractionData.liveData?.queue?.STANDBY?.waitTime ?? "-"}
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
              <Status status={attractionData.liveData.status} />
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
              className={attractionData.parkId ? "attraction-details-text div-clickable" : "attraction-details-text"}
              onClick={attractionData.parkId ? () => openLink(attractionData.parkId) : null}>
              {attractionData.parkName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};