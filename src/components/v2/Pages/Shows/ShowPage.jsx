import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { Status } from '../../../common/Status';
import { formatShowtime } from '../../../pageDetails/showHelper';
import './Shows.css'

export function ShowPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attractionResponse = await fetch(`${apiUrl}/entity/${id}`);
        if (!attractionResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await attractionResponse.json();
        setData(result);
        setLoading(false);
      } 
      catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, apiUrl]);

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
          <span>{data.name}</span>
        </h1>
      </div>
      <div className='waiting-time-circle-div'>
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
              <Status status={data.liveData.status} />
            </span>
          </div>
        </div>
        {
          data.liveData.showtimes?.length ?   
            <>      
              <div className="show-details-row">
                <div className="show-details-left">
                  {/* <img src={""} alt="icon" className="show-details-icon" /> */}
                  <span className="show-details-text-light">
                    Showtimes:
                  </span>
                </div>
                <div className="show-details-right">
                  {data.liveData.showtimes.map((show, index) => {
                    return (
                      <span className="show-details-text">
                        {formatShowtime(show.startTime, show.endTime, data.timezone)}
                      </span>
                    )
                  })}
                </div>
              </div>
            </>
          : 
            <></> 
        }
        <div className="attraction-details-row">
          <div className="attraction-details-left">
            {/* <img src={""} alt="icon" className="attraction-details-icon" /> */}
            <span className="attraction-details-text-light">
              Park:
            </span>
          </div>
          <div className="attraction-details-right">
            <span
              className={data.parkId ? "attraction-details-text div-clickable" : "attraction-details-text"}
              onClick={data.parkId ? () => openLink(data.parkId) : null}>
              {data.parkName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};