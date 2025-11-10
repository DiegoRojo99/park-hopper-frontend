import React, { useState } from 'react';
import { useAlerts } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/Loader';
import { Link } from 'react-router-dom';
import ChildrenTab, { TabOption } from '../../components/ChildrenTab';
import AlertCard from './AlertCard';

const AlertsPage: React.FC = () => {
  const { alerts, loading: alertsLoading } = useAlerts();
  const { user, userLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabOption>('Attractions');
  
  if (alertsLoading || userLoading) return <Loader />;

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Login Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need to be logged in to view and manage your alerts
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Get entities from alerts - alerts only have entityId, not the full entity data
  // We'll need to fetch the entity data or display alert info directly
  const attractionAlerts = alerts.filter(a => a.entityType === 'ATTRACTION' && a.status === 'ACTIVE');
  const showAlerts = alerts.filter(a => a.entityType === 'SHOW' && a.status === 'ACTIVE');

  const renderTabContent = () => {
    const displayAttractions = selectedTab === 'Attractions';
    const displayShows = selectedTab === 'Shows';

    return (
      <div className="space-y-8 w-full p-4">
        {/* Attractions Section */}
        {displayAttractions && attractionAlerts.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attractionAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* Shows Section */}
        {displayShows && showAlerts.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state for selected tab */}
        {((selectedTab === 'Attractions' && attractionAlerts.length === 0) ||
          (selectedTab === 'Shows' && showAlerts.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {`No ${selectedTab.toLowerCase()} alerts`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {`Set up alerts for ${selectedTab.toLowerCase()} to see them here`}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Header */}
      <div className="w-full bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Alerts</h1>
          <p className="text-muted dark:text-gray-500">
            Manage your notification alerts for attractions and shows
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ChildrenTab selectedTab={selectedTab} setTab={setSelectedTab} />

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};

export default AlertsPage;
