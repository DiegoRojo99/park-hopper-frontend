import React from "react";

export type TabOption = "All" | "Attractions" | "Shows" | "Restaurants";

interface ChildrenTabProps {
  selectedTab: TabOption;
  setTab: (tab: TabOption) => void;
  showAll?: boolean; // New prop to control whether to show "All" option
}

const tabOptions: { label: TabOption; icon: React.ReactNode }[] = [
  { label: "All", icon: <span>📊</span> },
  { label: "Attractions", icon: <img src='/icons/ferris-wheel.svg' alt='Attractions' /> },
  { label: "Shows", icon: <img src='/icons/drama.svg' alt='Shows' /> },
  { label: "Restaurants", icon: <img src='/icons/utensils.svg' alt='Restaurants' /> },
];

const ChildrenTab: React.FC<ChildrenTabProps> = ({ selectedTab, setTab, showAll = false }) => {
  const availableOptions = showAll ? tabOptions : tabOptions.filter(tab => tab.label !== "All");
  
  return (
    <div className="w-full py-4 mb-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
      <div className="flex flex-wrap justify-center md:justify-around gap-2 max-w-7xl mx-auto px-4">
        {availableOptions.map(({ label, icon }) => (
      <button
        key={label}
        onClick={() => setTab(label)}
        className={`flex flex-col md:flex-row items-center focus:outline-none px-3 py-2 rounded-t-lg transition-colors duration-200 ${
          selectedTab === label 
            ? 'border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold' 
            : 'border-b-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <span className="mb-1 md:mb-0 md:mr-2">{icon}</span>
        <span className="text-sm sm:text-base">{label}</span>
      </button>
      ))}
      </div>
    </div>
  );
};

export default ChildrenTab;