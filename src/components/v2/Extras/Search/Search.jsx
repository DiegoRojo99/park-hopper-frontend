import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

export default function Search({closeSearchBar}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/search?query=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSuggestions(results);
    } 
    catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/${suggestion.entityType?.toLowerCase()}s/${suggestion.id}`);
    setSearchTerm('');
    setSuggestions([]);
    closeSearchBar();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for parks, attractions, shows..."
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}
              <span className="suggestion-type"> ({suggestion.entityType}) </span>
              {
                suggestion.type !== "Attraction" ? <></> :
                <span className="suggestion-type">({suggestion.parentName})</span>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};