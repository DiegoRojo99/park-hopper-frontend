import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterBar from '../../common/FilterBar';
import { WaitingTimes } from '../../pageDetails/WaitingTimes';
import { Loader } from '../../common/Loader';
import { Showtimes } from '../../pageDetails/Showtimes';
import { useAuth } from '../../../contexts/AuthContext';
import Calendar from '../Extras/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarXmark } from '@fortawesome/free-regular-svg-icons';
import TabSelector from '../Extras/Tabs/TabSelector';
import { groupSchedule } from '../../../functions/data';

export function ParkPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [userAttractions, setUserAttractions] = useState(false);
  const [timezone, setTimezone] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [name, setName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("Attractions");
  const [showCalendar, setShowCalendar] = useState(false);
  const tabs = ["Attractions", "Shows"];
  const apiUrl = process.env.REACT_APP_API_URL; 
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkResponse = await fetch(`${apiUrl}/parks/${id}`);
        if (!parkResponse.ok) {
          throw new Error('Network response was not ok');
        }
        
        const parkData = await parkResponse.json();
        setData(parkData);
        setTimezone(parkData.timezone)
        setSchedule(groupSchedule(parkData.schedule));
        setLoading(false);
      } 
      catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    async function loadUserBookmarks(){
      try {
        const result = await fetch(`${apiUrl}/bookmarks`, { 
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
            return [];
          }
          throw new Error('Something went wrong');
        });
        
        setUserAttractions(result);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
    loadUserBookmarks()
  }, [id, apiUrl, user]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function searchName(text) {
    setName(text);
    const filteredNames = data[activeTab.toLowerCase()]?.filter((item) =>
      item.name?.toLowerCase().includes(text.toLowerCase())
    ) || [];
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/${activeTab.toLowerCase()}/${id}`;
    navigate(url); 
  }

  function changeTab(tab){
    setFilteredData([]);
    setName("");
    setActiveTab(tab);
  }
  
  function renderTabContent() {
    const selectedData = filteredData.length || name ? filteredData : data[activeTab.toLowerCase()] || [];
    
    if (loading) {
      return <></>;
    }
  
    switch (activeTab) {
      case "Shows":
        return (
          <div className="grid-element">
            <Showtimes shows={selectedData} timezone={timezone} />
          </div>
        );
      case "Restaurants":
        return (
          <div className="grid-element">
            {/* <RestaurantList
              restaurants={selectedData}
              openLink={openLink}
            /> */}
          </div>
        );
      case "Attractions":
      default:
        return (
          <div className="grid-element">
            <WaitingTimes attractions={selectedData} bookmarks={userAttractions} openLink={openLink} />
          </div>
        );
    }
  }
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="details-page">
      <div className="page-header">
        <h1>
          <span>{data.name}</span>
          <FontAwesomeIcon
            icon={showCalendar ? faCalendarXmark : faCalendar}
            className="calendar-icon"
            onClick={() => setShowCalendar(!showCalendar)}
          />
        </h1>
      </div>
      {/* <div className='park-details'>
        <p>
          {`Park Hours: 
            ${data.schedule.find(element => element.type === "OPERATING")?.openingTime.split("T")[1].split(":00-")[0]} - 
            ${data.schedule.find(element => element.type === "OPERATING")?.closingTime.split("T")[1].split(":00-")[0]}`
          }
        </p>
        <p>Local Hour: {getCurrentTimeInTimezone(timezone)}</p>
      </div> */}
  
      {!showCalendar ? (
        <>
          <TabSelector tabs={tabs} changeTab={changeTab} />
          <FilterBar name={name} searchName={searchName} />
          {renderTabContent()}
        </>
      ) : (
        <Calendar schedule={schedule} timezone={timezone} />
      )}
    </div>
  );  
}

