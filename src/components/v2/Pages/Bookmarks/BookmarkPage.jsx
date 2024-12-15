import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import './Bookmarks.css';
import { Loader } from '../../../common/Loader';
import { ReducedWaitingTimes } from '../../../pageDetails/ReducedWaitingTimes';
import { useNavigate } from 'react-router-dom';
import { Showtimes } from '../../../pageDetails/Showtimes';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const result = await fetch(`${apiUrl}/bookmarks/liveData`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            throw new Error('Not logged in');
          }
          throw new Error('Something went wrong');
        });

        console.log("Result: ", result);
        setBookmarks(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if(user){
      fetchBookmarks();
    }
  }, [apiUrl, user]);

  function openLink(id, link) {
    const url = `/${link}/${id}`;
    navigate(url); 
  }
  
  if (!user){
    return <p>Loading user...</p>;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bookmarks || Object.keys(bookmarks).length === 0) {
    return <div>No bookmarks found</div>;
  }

  return (
    <div id='bookmarks'>
      <h1>Bookmarks</h1>
      {Object.entries(bookmarks).map(([destinationId, destinationData]) => (
        <div key={destinationId} className="destination">
          <h2>{destinationData.name}</h2>
          {destinationData.parks.map((park) => (
            <div key={park.parkId} className="park" onClick={() => openLink(park.parkId, "parks")}>
              <h3>{park.name}</h3>
              {
                park.children.some(c => c.entityType==="ATTRACTION") &&
                <ReducedWaitingTimes 
                  attractions={park.children.filter(c => c.entityType==="ATTRACTION")} 
                  bookmarks={park.children.filter(c => c.entityType==="ATTRACTION")} 
                />
              }
              {
                park.children.some(c => c.entityType==="SHOW") &&
                <Showtimes 
                  shows={park.children.filter(c => c.entityType==="SHOW")}
                  bookmarks={park.children.filter(c => c.entityType==="SHOW")} 
                />
              }
            </div>
          ))}
          {destinationData.otherChildren.length > 0 && (
            <div className="ungrouped-entities">
              <h3>Other Children</h3>
              <ul>
                {destinationData.otherChildren.map((entity) => (
                  <li key={entity.id}>
                    <span>{entity.name}</span>
                    {/* {entity.liveData && (
                      <div className="live-data">
                        {Object.entries(entity.liveData).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )} */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export {
  BookmarkPage
};
