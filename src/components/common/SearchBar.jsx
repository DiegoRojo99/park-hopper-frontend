import React, { useState } from 'react';

function SearchBar({ onSearch }){
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        className='search-bar'
      />
      {/* <button onClick={handleSearch}>Search</button> */}
    </div>
  );
};

export default SearchBar;
