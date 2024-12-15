import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as lineBookmark } from '@fortawesome/free-regular-svg-icons';
import './Utils.css';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../common/Loader';
import { Status } from '../common/Status';
import { getNextShowtime } from './showHelper';
import { useNavigate } from 'react-router-dom';

export function Showtimes({ shows, timezone, bookmarks }){
  
  const [userBookmarks, setUserBookmarks] = useState(bookmarks);
  const { user } = useAuth(); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  
  function openLink(id) {
    const url = `/shows/${id}`;
    navigate(url); 
  }

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
  
  async function bookmarkShow(show, bookmarked){
    if(!user){
      alert("You have to be logged in");
      console.error('User is not logged in.');
      return;
    }

    const body = {
      "entityId": show.id,
    };

    const method = bookmarked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`${apiUrl}/bookmarks`, {
          method,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } 
    catch (error) {
      console.error(`Failed to ${bookmarked ? 'remove' : 'add'} favorite:`, error);
    } 
    finally {
      addBookmark(show, bookmarked);
    }
  }
  
  function addBookmark(show, bookmarked){
    let newBookmarks = !bookmarked ? [...userBookmarks, show] : userBookmarks.filter(b => b.id !== show.id);
    setUserBookmarks(newBookmarks);
  }

  return (
    <div className='waiting-times'>
      <div className='show-row header-row'>
        <p></p>
        <p>Show</p>
        <p>Showtimes</p>
      </div>
      { shows
        .filter(show => show?.status === "OPERATING" || show?.liveData?.status === "OPERATING")
        .map((show) => {
          const booked = userBookmarks.some(userAtt => userAtt.id === show.id);
          if(show.liveData){
            return (
              <div className='show-row'> 
                <FontAwesomeIcon 
                  icon={!booked ? lineBookmark : solidBookmark} 
                  className='star-icon' 
                  onClick={() => bookmarkShow(show, booked)} 
                />
                <p className='div-clickable' onClick={() => openLink(show.id)}>{show.name}</p>
                <p>
                  {show.liveData.showtimes?.length ? getNextShowtime(show.liveData.showtimes, show.timezone) : "-"}
                </p>
              </div>
            )
          }
          return (
            <div className='show-row'> 
              <FontAwesomeIcon 
                icon={!booked ? lineBookmark : solidBookmark} 
                className='star-icon' 
                onClick={() => bookmarkShow(show, booked)} 
              />
              <p className='div-clickable' onClick={() => openLink(show.id)}>{show.name}</p>
              <p>
                {show.showtimes?.length ? getNextShowtime(show.showtimes, timezone ?? show.timezone) : "-"}
              </p>
            </div>
          )
      })}
    </div>
  );
};