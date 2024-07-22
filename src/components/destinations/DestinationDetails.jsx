import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';

function DestinationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);

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
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/children`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        divideChildren(result.children);
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // function handleSaveDestination() {
  //   const { children, ...dataWithoutChildren } = data;

  //   fetch('http://192.168.0.3:8000/api/destinations', {
  //     method: 'POST',
  //     body: JSON.stringify(dataWithoutChildren),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Failed to save destination');
  //     }
  //     // Handle success
  //   })
  //   .catch(error => {
  //     // Handle error
  //   });
  // };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url);
  }

  function renderChildrenObjects(type) {
    if(!children[type].length){
      return <></>;
    }
    return (
      <div>
        <div>
          <h5>{type}</h5>
        </div>
        <div className='grid-element'>
          {children[type].map((child) => {
            return <Card child={child} openLink={openLink} />
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ width: '100%', display: 'flex' }}>
        <img src='.logo.png' />
        <p>Attractions</p>
        <p>Hotels</p>
        <p>Explore Parks</p>
        {/* Display hidden nav */}
      </div>
      <div style={{ width: '100%', display: 'flex' }}>
        <h1 style={{ margin: '32px 0', textAlign: 'center', width: '100%' }}>{data.name}</h1>
      </div>
      <div className='park-header'>
        <div className='breadcrumbs'>
          {/* Breadcrumbs */}
          <p style={{paddingLeft: '8px'}}> {"Home > Park"}  </p>
        </div>
        <div className='park-header-info'>
          <div className='park-logo-hours'>
            <img src=".\..\..\img\logo192.png" />
            <p>Today's Park Hours: -am to -pm</p>
            <a>Daily Hours</a>
          </div>
          <div style={{width: '40%'}}>

          </div>
          <div style={{width: '30%'}} className='header-map'>

          </div>
        </div>
      </div>

      {renderChildrenObjects("attractions")}
      {renderChildrenObjects("shows")}
    </div>
  );
};

export default DestinationDetails;
