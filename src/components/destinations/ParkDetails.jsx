import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import WideCard from '../common/WideCard';

export function ParkDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [children, setChildren] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [viewType, setViewType] = useState("Card");

  useEffect(() => {

    function divideChildren(children){
      let attractions = children.filter((child) => child.entityType === "ATTRACTION");
      let restaurants = children.filter((child) => child.entityType === "RESTAURANT");
      let hotels = children.filter((child) => child.entityType === "HOTEL");
      let shows = children.filter((child) => child.entityType === "SHOW");

      setChildren({ attractions, restaurants, hotels, shows});
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`);
        const scheduleRes = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/schedule`);
        
        if (!response.ok || !scheduleRes.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        divideChildren(result.liveData);
        setData(result);
        const groupedByDate = scheduleObj.schedule.reduce((acc, obj) => {
          const date = new Date(obj.date).toLocaleDateString(); // Extracting only the date part
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
          return acc;
        }, {});
        setSchedule(groupedByDate);
        setLoading(false);
      } catch (error) {
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
    const url = `/attractions/${id}`;
    navigate(url); 
  }

  function renderChildrenObjects(){
    if(!loading && viewType==="Card"){
      return(
        <div className='grid-element'>
          {children.attractions.map((child) => { 
          return (
            <Card child={child} openLink={openLink} />
          )})}
        </div>          
      );
    }
    else if(!loading && viewType==="List"){
      return(
        <>
          <div className='grid-element'>
            {children.attractions.map((child) => { 
            return (
              <WideCard child={child} openLink={openLink} />
            )})}
          </div>
        </>
      );
    }
    else{
      return <></>;
    }
  }

  
  if(loading){
    return <>Loading</>
  }
  return (
    <div>
      <div className='page-header'>
        <h1>{data.name}</h1>
        <ToggleSwitch setViewType={setViewType} />  
      </div>
               
      {renderChildrenObjects()}

    </div>
  );
};

function ToggleSwitch({setViewType}) {
  const [isChecked, setIsChecked] = useState(true);

  function handleToggle(){
    setViewType(!isChecked ? "Card" : "List")
    setIsChecked(!isChecked);
  };

  return (
    <div className="toggle-switch">
      <span className="toggle-icon left-icon" onClick={handleToggle}>
        &#x2630; {/* Left icon */}
      </span>
      <div className={`toggle-slider ${isChecked ? 'checked' : ''}`}></div>
      <span className="toggle-icon right-icon" onClick={handleToggle}>
        &#x2609; {/* Right icon */}
      </span>
    </div>
  );
}

