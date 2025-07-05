import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Layout } from './components/Layout';
import HomePage from './components/Home/HomePage';

function Parks() {
  return <h1 className="text-2xl font-bold">Parks Page</h1>;
}

function Login() {
  return <h1 className="text-2xl font-bold">Login Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="parks" element={<Parks />} />
          <Route path="login" element={<Login />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
