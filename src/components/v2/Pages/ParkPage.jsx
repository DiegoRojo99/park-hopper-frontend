import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TabGroup from '../../common/TabGroup';
import FilterBar from '../../common/FilterBar';
import { WaitingTimes } from '../../pageDetails/WaitingTimes';
import Card from '../../common/Card';
import { Loader } from '../../common/Loader';
import { Showtimes } from '../../pageDetails/Showtimes';
import { useAuth } from '../../../contexts/AuthContext';
import Calendar from '../Extras/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarXmark } from '@fortawesome/free-regular-svg-icons';

export function ParkPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [children, setChildren] = useState(null);
  const [userAttractions, setUserAttractions] = useState(false);
  const [timezone, setTimezone] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [name, setName] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [viewType, setViewType] = useState("List");
  const [activeTab, setActiveTab] = useState("Attractions");
  const [showCalendar, setShowCalendar] = useState(false);
  const [tabs, setTabs] = useState(["Attractions", "Shows", "Restaurants", "Hotels"]);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const { user } = useAuth(); 

  useEffect(() => {

    function divideChildren(children){
      let attractions = children.filter((child) => child.entityType === "ATTRACTION");
      let restaurants = children.filter((child) => child.entityType === "RESTAURANT");
      let hotels = children.filter((child) => child.entityType === "HOTEL");
      let shows = children.filter((child) => child.entityType === "SHOW");

      const dividedChildren = {attractions, restaurants, hotels, shows};
      const tabsOrder = ["Attractions", "Shows", "Restaurants", "Hotels"];
      const filteredTabs = [...tabsOrder.filter(tab => dividedChildren[tab.toLocaleLowerCase()]?.length)];
      setTabs(filteredTabs);
      
      return dividedChildren;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`);
        const scheduleRes = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/schedule`);
        const parkAttractionsResponse = await fetch(`${apiUrl}/parks/${id}/attractions`);
        if (!response.ok || !scheduleRes.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        
        let parkAttractions = await parkAttractionsResponse.json();
        parkAttractions = parkAttractions.map(att => att.id);
        
        let dividedChildren = divideChildren(result.liveData);
        dividedChildren.attractions = dividedChildren.attractions.filter(att => !parkAttractions.includes(att.id));
        setChildren(dividedChildren);
        setData(result);
        const groupedByDate = scheduleObj.schedule.reduce((acc, obj) => {
          const date = new Date(obj.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
          return acc;
        }, {});
        setTimezone(scheduleObj.timezone)
        setSchedule(groupedByDate);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    async function loadUserFavorites(){
      try {
        const result = await fetch(`${apiUrl}/favorites`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          }
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          else if(response.status === "401"){
            throw new Error('Not logged in');
          }
          throw new Error('Something went wrong');
        });
        
        setUserAttractions(result);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
    loadUserFavorites()
  }, [id]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function searchName(text){
    setName(text);
    const filteredNames = children[activeTab.toLowerCase()].filter((c) => c.name?.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/attractions/${id}`;
    navigate(url); 
  }

  function renderCalendar(){
    if(loading){
      return <></>
    }
    return <Calendar schedule={schedule} timezone={timezone} />
  }

  function renderChildrenObjects(){
    let selectedChildren = filteredData.length || name ? filteredData : children[activeTab.toLowerCase()];
    if(loading){
      return <></>
    }
    if(activeTab === "Shows"){
      return(
        <div className='grid-element'>
          <Showtimes shows={selectedChildren} />
        </div>
      );
    }
    else if(viewType==="List"){
      return(
        <div className='grid-element'>
          <WaitingTimes attractions={selectedChildren} favorites={userAttractions} />
        </div>
      );
    }
    else{
      return(
        <>
          <div className='grid-element'>
            <WaitingTimes attractions={children.attractions} favorites={userAttractions} />
          </div>
        </>
      );
    }
  }
  
  if(loading){
    return <Loader />;
  }
  return (
    <div className='details-page'>
      <div className='page-header'>
        <h1>
          <span>{data.name}</span>
          <FontAwesomeIcon icon={showCalendar ? faCalendarXmark : faCalendar} className='calendar-icon' onClick={() => setShowCalendar(!showCalendar)} />
        </h1>
      </div>

      {!showCalendar ? 
        <>    
          <div className='tab-group-row' >
            <TabGroup tabs={tabs} activeTab={activeTab} changeTab={setActiveTab} />
            {/* <ToggleSwitch setViewType={setViewType} />   */}
          </div>
          <FilterBar name={name} searchName={searchName} />
          {renderChildrenObjects()}
        </> : 
        renderCalendar()
      }

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

