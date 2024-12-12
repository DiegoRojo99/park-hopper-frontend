import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages/Pages.css';
import './Explore.css';
import '../../common/Common.css';
import FilterBar from '../../common/FilterBar';
import { Loader } from '../../common/Loader';
import ParksMap from '../Map/ParksMap';
import TabSelector from '../Extras/Tabs/TabSelector';

function ExplorePage(){
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [activeTab, setActiveTab] = useState("Country");
  const apiUrl = process.env.REACT_APP_API_URL; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/allParks`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function searchName(text){
    setName(text);
    const filteredNames = data.filter((dest) => {
      return (
        (dest.name?.toLowerCase().includes(text.toLowerCase())) ||
        (activeTab === "Country" && dest.country?.toLowerCase().includes(text.toLowerCase()))||
        (activeTab === "Destination" && dest["Destination Name"]?.toLowerCase().includes(text.toLowerCase()))
      )
    })
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderLandingContent(){
    switch(activeTab){
      case "Country":
        return renderFieldList("country");
      case "Group":
        return renderGroupList();        
      case "Destination":
        return renderFieldList("Destination Name");
      case "Map":
        const places = filteredData.map(park => {
          let reducedPark = {
            name: park.name,
            lng: park.location?.longitude,
            lat: park.location?.latitude,
            id: park.id,
          }
          return reducedPark;
        });
      
        return (
          <div className='explore-map-div'>
            <ParksMap openLink={openLink} places={places} />
          </div>
        );
      default:
        return <></>

    }
  }
  
  function renderGroupList(){
    const groupMap = {};
    filteredData.forEach((row) => {
      if(groupMap[row.name]?.length){
        groupMap[row.name] = [...groupMap[row.name], row];
      }else{
        groupMap[row.name] = [row];
      }
    });
    const groupedParks = Object.keys(groupMap);
    groupedParks.sort((a,b) => a.localeCompare(b));
    const firstColumn = groupedParks.splice(0, Math.ceil(groupedParks.length / 3));
    const secondColumn = groupedParks.splice(0, Math.ceil(groupedParks.length / 2));
    return (
      <div className='country-list-div'>
        <div className='column'>
          {firstColumn.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {secondColumn.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {groupedParks.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>   
      </div>
    )
  }

  function renderFieldList(field){
    const groupedMap = {};
    filteredData.forEach((row) => {
      if(groupedMap[row[field]]?.length){
        groupedMap[row[field]] = [...groupedMap[row[field]], row];
      }else{
        groupedMap[row[field]] = [row];
      }
    });
    const groupedParks = Object.keys(groupedMap);
    groupedParks.sort((a,b) => a.localeCompare(b));
    let number = field === "country" ? 10 : groupedParks.length / 2 
    const firstColumn = groupedParks.length > number ? 
      groupedParks.splice(0, number + 3) : 
      groupedParks.splice(0, Math.ceil(groupedParks.length / 2));
    return (
      <div className='country-list-div'>
        <div className='column'>
          {firstColumn.map(c => <ParkGroup list={groupedMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {groupedParks.map(c => <ParkGroup list={groupedMap[c]} name={c} openLink={openLink} /> )}
        </div>
      </div>
    )
  }

  function changeTab(newTab){
    setActiveTab(newTab);
  }

  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={{height: '100%', paddingBottom: '64px'}}>
      <div className='landing-big-img' alt="Generic Theme Park" />
      <FilterBar name={name} searchName={searchName} placeholder={'Search a theme park...'} />
      <div className='landing-main'>
        <TabSelector tabs={["Country", "Destination"]} changeTab={changeTab} />
        {renderLandingContent()}
      </div>
      
      <div>
      </div>
    </div>
  );
};

function ParkGroup({list, name, openLink}){
  list.sort((a,b) => a?.name?.localeCompare(b?.name));
  return (
    <div className='group-list' key={name + "-group"}>
      <p className='group-name'>{name}</p>
      {list.map(park => 
        <div className='group-park'>
          <p className='group-park-name' onClick={() => openLink(park.id)}>
            {park.name}
          </p>
          <div className='group-park-link'>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default ExplorePage;