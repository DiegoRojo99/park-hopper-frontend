import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterBar from '../../common/FilterBar';
import { WaitingTimes } from '../../pageDetails/WaitingTimes';
import Card from '../../common/Card';
import { Loader } from '../../common/Loader';
import { Showtimes } from '../../pageDetails/Showtimes';
import { useAuth } from '../../../contexts/AuthContext';
import TabSelector from '../Extras/Tabs/TabSelector';

export function BookmarkPage(){
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [children, setChildren] = useState(null);
  const [userAttractions, setUserAttractions] = useState(false);
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
            throw new Error('Not logged in');
          }
          throw new Error('Something went wrong');
        });
        console.log("Result: ", result);
        setLoading(false);
        setUserAttractions(result);
        setFilteredData(result);
        setChildren(divideChildren(result));
      } catch (error) {
        console.error(error)
      }
    }

    if(user){
      loadUserBookmarks();
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
        <h1>Bookmarks</h1>
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

