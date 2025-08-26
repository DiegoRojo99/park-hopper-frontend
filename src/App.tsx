import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';

/* CONTEXT */
import { AuthProvider } from './context/AuthContext';

/* PAGES */
import HomePage from './pages/Home/HomePage';
import Parks from './pages/Parks/Parks';
import { ParkDetailsContainer } from './pages/Parks/ParkDetails';
import LoginPage from './pages/Login/LoginPage';

/* STYLES */
import './index.css';
import SyncParksPage from './pages/Sync/SyncParks';
import AdminImageLinker from './pages/Admin/AdminImageLinker';

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
      { path: 'admin/images', element: <AdminImageLinker /> },
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
