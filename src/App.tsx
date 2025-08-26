import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="parks" element={<Parks />} />
            <Route path="parks/:parkId" element={<ParkDetailsContainer />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="sync" element={<SyncParksPage />} />
            <Route path="admin/images" element={<AdminImageLinker />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
