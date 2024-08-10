import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages/Pages.css';
import '../../common/Common.css';
import TabGroup from '../../common/TabGroup';
import FilterBar from '../../common/FilterBar';
import { Loader } from '../../common/Loader';

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
    const filteredNames = data.filter((dest) => dest.ParkName?.toLowerCase().includes(text.toLowerCase()))
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderLandingContent(){
    switch(activeTab){
      case "Country":
        return renderFieldList("Country");
      case "Group":
        return renderGroupList();        
      case "Destination":
        return renderFieldList("DestinationName");
      default:
        return <></>

    }
  }
  
  function renderGroupList(){
    const groupMap = {};
    filteredData.forEach((row) => {
      if(groupMap[row.ParkName]?.length){
        groupMap[row.ParkName] = [...groupMap[row.ParkName], row];
      }else{
        groupMap[row.ParkName] = [row];
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
    let number = field === "Country" ? 10 : groupedParks.length / 2 
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
    <div style={{height: '100%'}}>
      <div className='landing-big-img' alt="Generic Theme Park" />
      <FilterBar name={name} searchName={searchName} placeholder={'Search a theme park...'} />
      <div className='landing-main'>
        <TabGroup tabs={["Country", "Map", "Destination"]} activeTab={activeTab} changeTab={changeTab} />
        {renderLandingContent()}
      </div>
      
      <div>
      </div>
    </div>
  );
};

function ParkGroup({list, name, openLink}){
  list.sort((a,b) => a.ParkName.localeCompare(b.ParkName));
  return (
    <div className='group-list' key={name + "-group"}>
      <p className='group-name'>{name}</p>
      {list.map(park => 
        <div className='group-park'>
          <p className='group-park-name' onClick={() => openLink(park.ParkID)}>
            {park.ParkName}
          </p>
          <div className='group-park-link'>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default ExplorePage;