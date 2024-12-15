import React, { useState, useEffect } from 'react';
import FilterBar from '../../common/FilterBar';
import { WaitingTimes } from '../../pageDetails/WaitingTimes';
import { Loader } from '../../common/Loader';
import { Showtimes } from '../../pageDetails/Showtimes';
import { useAuth } from '../../../contexts/AuthContext';
import TabSelector from '../Extras/Tabs/TabSelector';

export function FavPage(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [children, setChildren] = useState(null);
  const [userAttractions, setUserAttractions] = useState([]);
  const [name, setName] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
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
      } 
      catch (error) {
        setError(error)
      }
    }

    if(user){
      loadUserFavorites();
    }

  }, [user, apiUrl]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function searchName(text){
    setName(text);
    const filteredNames = children[activeTab.toLowerCase()].filter((c) => c.name?.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filteredNames);
  }

  function renderChildrenObjects(){
    let selectedChildren = filteredData.length || name ? filteredData : children[activeTab.toLowerCase()];
    if(loading){
      return <></>
    }
    if(activeTab === "Shows"){
      return(
        <div className='grid-element'>
          <Showtimes shows={selectedChildren} bookmarks={userAttractions}/>
        </div>
      );
    }
    else {
      return(
        <div className='grid-element'>
          <WaitingTimes attractions={userAttractions} bookmarks={userAttractions} />
        </div>
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
        </div> 
      : 
        <></>
      }
      <FilterBar name={name} searchName={searchName} />
      {renderChildrenObjects()}
    </div>
  );
};
