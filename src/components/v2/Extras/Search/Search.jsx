import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

function Search({ data }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  function handleInputChange(event) {
    const value = event.target.value;
    setQuery(value);

    // Filter data based on query, assuming `data` contains the list of entities.
    const filteredSuggestions = data.filter(entity =>
      entity.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }

  function handleSelectSuggestion(entity) {
    // Redirect based on entity type
    switch (entity.type) {
      case 'park':
        navigate(`/parks/${entity.id}`);
        break;
      case 'attraction':
        navigate(`/attractions/${entity.id}`);
        break;
      case 'show':
        navigate(`/shows/${entity.id}`);
        break;
      default:
        break;
    }
    setQuery('');
    setSuggestions([]);
  }

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="search-input"
      />
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((entity) => (
            <div
              key={entity.id}
              onClick={() => handleSelectSuggestion(entity)}
              className="suggestion-item"
            >
              {entity.name} ({entity.type})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
