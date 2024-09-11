import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faTriangleExclamation, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as lineStar } from '@fortawesome/free-regular-svg-icons';
import './Utils.css';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';
import { Status } from '../common/Status';
import { parseTime } from '../common/Functions';

export function Showtimes({ shows }){
  
  // const [userAttractions, setUserAttractions] = useState(false);
  const { user } = useAuth(); 
  const apiUrl = process.env.REACT_APP_API_URL;

  // async function loadUserFavorites(){
  //   try {
  //     const result = await fetch(`${apiUrl}/favorites`, { 
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${user.accessToken}`
  //       }
  //     })
  //     .then(response => response.json());
      
  //     setUserAttractions(result);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   if(user && user.accessToken){
  //     // loadUserFavorites();
  //   }
  // }, [user]);

  if (!shows) {
    return <Loader />;
  }
  else if(!shows.length){
    return <p>No matching shows</p>
  }

  // function sortByWaitTime(a, b){
  //   const aWaitTime = a.queue?.STANDBY?.waitTime;
  //   const bWaitTime = b.queue?.STANDBY?.waitTime;
  //   if(!aWaitTime && bWaitTime){
  //     return 1;
  //   }
  //   else if (!bWaitTime && aWaitTime){
  //     return -1;
  //   }
  //   else if(!aWaitTime && !bWaitTime){
  //     if(a.status === b.status){
  //       return 0;
  //     }
  //     else if(a.status === "CLOSED"){
  //       return 1;
  //     }
  //     else if(a.status === "OPERATING"){
  //       return -1;
  //     }
  //     else if(b.status === "CLOSED"){
  //       return -1;
  //     }
  //     else if(b.status === "OPERATING"){
  //       return 1;
  //     }
  //   }
  //   else{
  //     return bWaitTime - aWaitTime;
  //   }
  // }

  async function selectFavShow(show, fav){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    if(!fav){
      const body = {
        "entityId": show.id,
        "type": "show"
      }
  
      try {
        const response = await fetch(`${apiUrl}/addFavorite`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // loadUserFavorites();
      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    } 
    else{
      const body = {
        "entityId": show.id,
        "type": "show"
      }
  
      try {
        const response = await fetch(`${apiUrl}/removeFavorite`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // loadUserFavorites();
      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    }  
    
  }

  return (
    <div className='waiting-times'>
      <div className='show-row header-row'>
        <p></p>
        <p>Show</p>
        <p>Showtimes</p>
      </div>
      { shows.filter(show => show?.status === "OPERATING").map((a) => {
        const fav = false; // userAttractions ? userAttractions.some(userAtt => userAtt.EntityID === a.id) : false;
        return (
          <div className='show-row'> 
            <FontAwesomeIcon 
              icon={!fav ? lineStar : solidStar} 
              className='star-icon' 
              onClick={() => selectFavShow(a, fav)} 
            />
            <p>{a.name}</p>
            <p>
            {a.showtimes?.length ? a.showtimes.map((show, index) => 
              {
                const time = parseTime(show?.startTime);
                const comma = (index !== 0) ? ", " : "";
                return comma + time;
              }
            ) : "-"}
            </p>
          </div>
        )
      })}
    </div>
  );
};