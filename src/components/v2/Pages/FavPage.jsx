import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterBar from '../../common/FilterBar';
import { WaitingTimes } from '../../pageDetails/WaitingTimes';
import Card from '../../common/Card';
import { Loader } from '../../common/Loader';
import { Showtimes } from '../../pageDetails/Showtimes';
import { useAuth } from '../../../contexts/AuthContext';
import TabSelector from '../Extras/Tabs/TabSelector';

export function FavPage(){
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [children, setChildren] = useState(null);
  const [userAttractions, setUserAttractions] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [name, setName] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [viewType, setViewType] = useState("List");
  const [activeTab, setActiveTab] = useState("Attractions");
  const [tabs, setTabs] = useState(["Attractions"]);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const { user } = useAuth(); 

  useEffect(() => {

    function divideChildren(entitites){
      let attractions = entitites.filter((child) => child.EntityType.toUpperCase() === "ATTRACTION");
      let restaurants = entitites.filter((child) => child.EntityType.toUpperCase() === "RESTAURANT");
      let hotels = entitites.filter((child) => child.EntityType.toUpperCase() === "HOTEL");
      let shows = entitites.filter((child) => child.EntityType.toUpperCase() === "SHOW");

      const dividedChildren = {attractions, restaurants, hotels, shows};
      const tabsOrder = ["Attractions", "Shows", "Restaurants", "Hotels"];
      const filteredTabs = tabsOrder.filter(tab => dividedChildren[tab.toLocaleLowerCase()]?.length);
      setTabs(filteredTabs);
      
      return dividedChildren;
    }

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

        setLoading(false);
        setUserAttractions(result);
        setFilteredData(result);
        setChildren(divideChildren(result));
      } catch (error) {
        console.error(error)
      }
    }

    if(user){
      loadUserFavorites();
    }

  }, [user]);

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
          <WaitingTimes attractions={userAttractions} favorites={userAttractions} />
        </div>
      );
    }
    else{
      return(
        <>
          <div className='grid-element'>
            <WaitingTimes attractions={userAttractions} favorites={userAttractions} />
          </div>
        </>
      );
    }
  }

  
  if(loading){
    return <Loader />;
  }
  else if(!loading && !user){
    return <>Need to be logged in...</>
  }
  return (
    <div className='details-page'>
      <div className='page-header'>
        <h1>Favorites</h1>
      </div>
      
      {tabs.length > 1 ? 
        <div className='tab-group-row' >
          <TabSelector tabs={tabs} changeTab={setActiveTab} />
          {/* <ToggleSwitch setViewType={setViewType} />   */}
        </div> : 
        <></>
      }
      <FilterBar name={name} searchName={searchName} />
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

