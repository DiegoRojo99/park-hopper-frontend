import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function WaitingTimes({ type }){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [attractions, setAttractions] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const objectType = result?.entityType?.toLowerCase();
        if (type && objectType && !type.includes(objectType)) {
          const newUrl = window.location.pathname.replace(`/${type}s/`, `/${objectType}s/`);
          alert(newUrl)
          navigate(newUrl);
        }
        let attractionsObj = result.liveData.filter((child) => child.entityType === "ATTRACTION");
        attractionsObj.sort((a, b) => a.name.localeCompare(b.name));
        setData(result);        
        setAttractions(attractionsObj);
      
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  // function openLink(id) {
  //   const url = `/attractions/${id}`;
  //   navigate(url); 
  // }


  return (
    <div>
      <div style={{width: '100%', display: 'flex'}}>
        <h1 style={{margin: '32px 0', textAlign: 'center', width: '100%'}}>{data.name}</h1>
        {/* <span style={{margin: '32px 0', cursor: 'pointer'}} className="material-symbols-outlined">calendar_month</span> */}
      </div>
               
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