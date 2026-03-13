import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';

/* CONTEXT */
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AlertProvider } from './context/AlertContext';
import { VisitProvider } from './context/VisitContext';

/* STYLES */
import './index.css';

/* PAGES */
import HomePage from './pages/Home/HomePage';
import Parks from './pages/Parks/Parks';
import { ParkDetailsContainer } from './pages/Parks/Details/ParkDetails';
import AttractionDetails from './pages/Attractions/Details/AttractionDetails';
import ShowDetails from './pages/Shows/Details/ShowDetails';
import LoginPage from './pages/Login/LoginPage';
import SyncParksPage from './pages/Sync/SyncParks';
import BookmarksPage from './pages/Bookmarks/BookmarksPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import VisitsPage from './pages/Visits/VisitsPage';

/* ADMIN PAGES */
import AdminImageLinker from './pages/Admin/AdminImageLinker';
import Admin from './pages/Admin/Admin';
import Countries from './pages/Admin/Countries';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'parks', element: <Parks /> },
      { path: 'parks/:parkId', element: <ParkDetailsContainer /> },
      { path: 'attractions/:attractionId', element: <AttractionDetails /> },
      { path: 'shows/:showId', element: <ShowDetails /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'visits', element: <VisitsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'sync', element: <SyncParksPage /> },
      { path: 'admin', element: <Admin /> },
      { path: 'admin/images', element: <AdminImageLinker /> },
      { path: 'admin/countries', element: <Countries /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BookmarkProvider>
          <VisitProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </VisitProvider>
        </BookmarkProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
