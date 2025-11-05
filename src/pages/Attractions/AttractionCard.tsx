import { LiveAttraction } from "../../types/db";
import { BookmarkButton } from "../../components/BookmarkButton";

export default function AttractionCard({ attraction }: { attraction: LiveAttraction }) {
  if (!attraction) return null;

  const waitTime = attraction.waitTime || null;
  const statusColors: { [key: string]: string } = {
    OPERATING: 'text-green-600',
    DOWN: 'text-yellow-600',
    CLOSED: 'text-red-600',
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 relative">
      {/* Bookmark button in top-right corner */}
      <div className="absolute top-2 right-2">
        <BookmarkButton entityId={attraction.id} entityType="ATTRACTION" size="sm" />
      </div>
      
      <div className="flex justify-between items-start pr-8">
        <div className="flex flex-col flex-1">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{attraction.name}</h3>
          {attraction.status ? (
            <p className={`text-sm ${statusColors[attraction.status] || "text-gray-500"}`}>
              {attraction.status}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Unknown</p>
          )}
        </div>
        <div className="text-right min-w-[80px] self-end mt-2">
          {waitTime ? (
            <span
              className={`text-xl font-semibold ${
                waitTime > 60 ? "text-red-500" : waitTime > 30 ? "text-yellow-500" : "text-green-600"
              }`}
            >
              {waitTime} min
            </span>
          ) : (
            <span className="text-xl text-gray-500 italic">-</span>
          )}
        </div>
      </div>
    </div>
  );
};
