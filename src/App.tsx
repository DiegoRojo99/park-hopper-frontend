import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

/* CONTEXT */
import { AuthProvider } from './context/AuthContext';

/* PAGES */
import HomePage from './pages/Home/HomePage';
import ParkGroups from './pages/Parks/ParkGroups';
import { ParkDetailsContainer } from './pages/Parks/ParkDetails';
import LoginPage from './pages/Login/LoginPage';

/* STYLES */
import './index.css';
import SyncParksPage from './pages/Sync/SyncParks';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="parks" element={<ParkGroups />} />
            <Route path="parks/:parkId" element={<ParkDetailsContainer />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="sync" element={<SyncParksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
