
export default function TabGroup({tabs, activeTab, changeTab}){
  return (
    <div className="tab-group">
      {tabs.map(tab => <div className={tab === activeTab ? "active-tab-element" : "tab-element"} onClick={() => changeTab(tab)}>{tab}</div>)}
    </div>
  )
}