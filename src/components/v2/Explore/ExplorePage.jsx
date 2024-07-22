import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pages/Pages.css';
import TabGroup from '../../common/TabGroup';
import FilterBar from '../../common/FilterBar';

function LandingPage(){
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [activeTab, setActiveTab] = useState("Country");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.3:8000/api/allParks');
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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
        return renderCountryList();
      case "Group":
        return renderGroupList();
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
    const countries = Object.keys(groupMap);
    countries.sort((a,b) => a.localeCompare(b));
    const firstColumn = countries.splice(0, Math.ceil(countries.length / 3));
    const secondColumn = countries.splice(0, Math.ceil(countries.length / 2));
    return (
      <div className='country-list-div'>
        <div className='column'>
          {firstColumn.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {secondColumn.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {countries.map(c => <ParkGroup list={groupMap[c]} name={c} openLink={openLink} /> )}
        </div>   
      </div>
    )
  }

  function renderCountryList(){
    const countryMap = {};
    filteredData.forEach((row) => {
      if(countryMap[row.Country]?.length){
        countryMap[row.Country] = [...countryMap[row.Country], row];
      }else{
        countryMap[row.Country] = [row];
      }
    });
    const countries = Object.keys(countryMap);
    countries.sort((a,b) => a.localeCompare(b));
    const firstColumn = countries.length > 10 ? countries.splice(0, 13) : countries.splice(0, Math.ceil(countries.length / 2));
    return (
      <div className='country-list-div'>
        <div className='column'>
          {firstColumn.map(c => <ParkGroup list={countryMap[c]} name={c} openLink={openLink} /> )}
        </div>       
        <div className='column'>
          {countries.map(c => <ParkGroup list={countryMap[c]} name={c} openLink={openLink} /> )}
        </div>
      </div>
    )
  }

  function changeTab(newTab){
    setActiveTab(newTab);
  }

  return (
    <div style={{height: '100%'}}>
      <div className='landing-big-img' alt="Generic Theme Park" />
      <FilterBar name={name} searchName={searchName} placeholder={'Search a theme park...'} />
      <div className='landing-main'>
        <TabGroup tabs={["Country", "Map"]} activeTab={activeTab} changeTab={changeTab} />
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

export default LandingPage;
