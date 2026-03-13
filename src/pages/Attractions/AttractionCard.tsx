import { Link } from 'react-router-dom';
import { LiveAttraction } from "../../types/db";
import { BookmarkButton } from "../../components/BookmarkButton";
import AlertButton from "../../components/AlertButton";
import VisitButton from "../../components/VisitButton";

export default function AttractionCard({ attraction }: { attraction: LiveAttraction }) {
  if (!attraction) return null;

  const waitTime = attraction.waitTime || null;
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'OPERATING':
        return { 
          bg: 'bg-green-100 dark:bg-green-900', 
          text: 'text-green-800 dark:text-green-200',
          icon: '●'
        };
      case 'DOWN':
        return { 
          bg: 'bg-yellow-100 dark:bg-yellow-900', 
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: '⚠'
        };
      case 'CLOSED':
        return { 
          bg: 'bg-red-100 dark:bg-red-900', 
          text: 'text-red-800 dark:text-red-200',
          icon: '✕'
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-600 dark:text-gray-400',
          icon: '?'
        };
    }
  };

  const statusConfig = getStatusConfig(attraction.status || 'unknown');

  const getWaitTimeConfig = (time: number) => {
    if (time <= 15) return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700' };
    if (time <= 30) return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' };
    if (time <= 60) return { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700' };
    return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 overflow-hidden group flex flex-col h-full">
      {/* Header with name and status */}
      <Link to={`/attractions/${attraction.id}`} className="block">
        <div className="p-6 pb-4 flex-1 cursor-pointer">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {attraction.name}
          </h3>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} shrink-0`}>
            <span className="text-sm">{statusConfig.icon}</span>
            <span className="capitalize">{(attraction.status || 'unknown').toLowerCase()}</span>
          </div>
        </div>

        {/* Wait time display - prominent center section */}
        <div className="flex justify-center mb-6">
          {waitTime ? (
            <div className={`px-12 py-6 rounded-3xl border-2 w-full max-w-xs ${getWaitTimeConfig(waitTime).bg} ${getWaitTimeConfig(waitTime).border} ${getWaitTimeConfig(waitTime).text}`}>
              <div className="text-center">
                <div className="text-4xl font-bold leading-none">{waitTime}</div>
                <div className="text-base font-medium opacity-80 mt-1">minutes wait</div>
              </div>
            </div>
          ) : (
            <div className="px-12 py-6 rounded-3xl border-2 w-full max-w-xs bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 dark:text-gray-500 leading-none">—</div>
                <div className="text-base font-medium text-gray-400 dark:text-gray-500 mt-1">no wait</div>
              </div>
            </div>
          )}
        </div>
        </div>
      </Link>

      {/* Action buttons footer - always at bottom */}
      <div className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600 p-5 mt-auto">
        <div className="grid grid-cols-3 gap-4">
          {/* Visit Button */}
          <VisitButton 
            entityType="attraction"
            entityId={attraction.id}
            entityName={attraction.name}
            hideLabel={true}
            className="w-full h-14 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          />
          
          {/* Alert Button */}
          <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md w-full">
            <AlertButton 
              entityId={attraction.id} 
              entityType="ATTRACTION" 
              currentWaitTime={attraction.waitTime}
            />
          </div>
          
          {/* Bookmark Button */}
          <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md w-full">
            <BookmarkButton entityId={attraction.id} entityType="ATTRACTION" size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
