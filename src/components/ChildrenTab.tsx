import React from "react";

export type TabOption = "Attractions" | "Shows" | "Restaurants";

interface ChildrenTabProps {
  selectedTab: TabOption;
  setTab: (tab: TabOption) => void;
}

const tabOptions: { label: TabOption; icon: React.ReactNode }[] = [
  { label: "Attractions", icon: <img src='/icons/ferris-wheel.svg' alt='Attractions' /> },
  { label: "Shows", icon: <img src='/icons/drama.svg' alt='Shows' /> },
  { label: "Restaurants", icon: <img src='/icons/utensils.svg' alt='Restaurants' /> },
];

const ChildrenTab: React.FC<ChildrenTabProps> = ({ selectedTab, setTab }) => (
  <div className="py-4" style={{ display: "flex", gap: "1rem" }}>
    {tabOptions.map(({ label, icon }) => (
      <button
        key={label}
        onClick={() => setTab(label)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          border: "none",
          borderBottom: selectedTab === label ? "2px solid #0078d4" : "2px solid transparent",
          background: "none",
          cursor: "pointer",
          fontWeight: selectedTab === label ? "bold" : "normal",
          color: selectedTab === label ? "#0078d4" : "#333",
          fontSize: "1rem",
        }}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    ))}
  </div>
);

export default ChildrenTab;