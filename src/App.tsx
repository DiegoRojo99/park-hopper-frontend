import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './components/Home/HomePage';
import ParkGroups from './components/Parks/ParkGroups';
import { ParkDetailsContainer } from './components/Parks/ParkDetails';

import './index.css';

function Login() {
  return <h1 className="text-2xl font-bold">Login Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="parks" element={<ParkGroups />} />
          <Route path="parks/:parkId" element={<ParkDetailsContainer />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
