import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../common/Loader';

function NotFoundPage(){
  return (
    <>
    <Loader />
    <div className='not-found-container'>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
    
    </>
  );
};

export default NotFoundPage;
