import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';

/* CONTEXT */
import { AuthProvider } from './context/AuthContext';

/* STYLES */
import './index.css';

/* PAGES */
import HomePage from './pages/Home/HomePage';
import Parks from './pages/Parks/Parks';
import { ParkDetailsContainer } from './pages/Parks/Details/ParkDetails';
import LoginPage from './pages/Login/LoginPage';
import SyncParksPage from './pages/Sync/SyncParks';

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
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AuthProvider>
  );
}
