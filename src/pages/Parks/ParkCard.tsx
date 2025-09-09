import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LivePark } from '../../types/Park';

type ParkCardProps = {
  park: LivePark;
};

const ParkCard: React.FC<ParkCardProps> = ({ park }) => {
  const navigate = useNavigate();
  const logo = park.logoImage?.url;
  const main = park.mainImage?.url;
  const status = park.status;

  return (
    <div
      onClick={() => navigate(`/parks/${park.id}`)}
      className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
    >
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {status && (
          <div className={`absolute top-2 left-2 px-3 py-1 text-xs font-medium text-white rounded-lg ${
            status === 'OPERATING' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {status === 'OPERATING' ? 'Open' : 'Closed'}
          </div>
        )}
        {main ? (
          <img src={main} alt={park.name + ' main'} className="w-full h-full object-cover" />
        ) : logo ? (
          <img src={logo} alt={park.name + ' logo'} className="w-32 h-32 object-contain" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{park.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{park.destination?.name}</p>
      </div>
    </div>
  );
};

export default ParkCard;
