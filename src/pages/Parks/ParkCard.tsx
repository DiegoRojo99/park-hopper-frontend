import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LivePark } from '../../types/Park';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getScheduleInfo } from '../../lib/schedule';

type ParkCardProps = {
  park: LivePark;
};

export default function ParkCard({ park }: ParkCardProps) {
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
      <ParkCardInfo park={park} />
    </div>
  );
};

function ParkCardInfo({ park }: { park: LivePark }) {
  const location = (park.city && park.country) ? `${park.city}, ${park.country.name}` : undefined;
  const schedule = getScheduleInfo(park);
  
  return (
    <div className="p-4 flex flex-col items-start gap-1">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{park.name}</h2>
      {location ? (
        <div className="flex items-center text-gray-500 text-sm items-center">
          <MapPinIcon className="h-4 w-4 inline-block mr-1" />
          {location}
        </div>
      ) : null}
      {schedule.regular ? (
        <div className="flex items-center text-gray-500 text-sm items-center">
          <ClockIcon className="h-4 w-4 inline-block mr-1" />
          {schedule.regular.open} - {schedule.regular.close}
        </div>
      ) : null}
    </div>
  );
}
