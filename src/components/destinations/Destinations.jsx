import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Destinations.css';
import Card from '../common/Card';
import TextField from '@mui/material/TextField';

function Destinations(){
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.themeparks.wiki/v1/destinations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.destinations);
        setFilteredData(result.destinations);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array means this effect will run once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function searchName(text){
    setName(text);
    const filteredNames = data.filter((dest) => dest.name.toLowerCase().includes(text.toLowerCase()))
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/destinations/${id}`;
    navigate(url); 
  }

  return (
    <div style={{height: '100%'}}>
      <h1 style={{margin: '16px'}}>Destinations:</h1>
      <FilterBar name={name} searchName={searchName} />
      
      <div className='grid-all'>
      {filteredData.map((dest, index) => (
        <Card key={"destination-"+index} child={dest} openLink={openLink} /> 
      ))}
      </div>
    </div>
  );
};

function FilterBar({name, searchName}){

  return (
    <div className='filter-bar'>
      <TextField 
        id="outlined-basic" 
        label="Name" 
        // variant="outlined" 
        // color=''
        value={name}
        onChange={(event) => { searchName(event.target.value)}}
        focused
        sx={{ color: 'white' }}
      />

    </div>
  )
}

export default Destinations;
