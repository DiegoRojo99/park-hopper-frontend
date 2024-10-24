import './App.css';
import Nav from './components/nav/Nav';
import Destinations from './components/destinations/Destinations';
import DestinationDetails from './components/destinations/DestinationDetails';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginRegister from './components/login/LoginRegister';
import ExplorePage from './components/v2/Explore/ExplorePage';
import { ParkPage } from './components/v2/Pages/ParkPage';
import Home from './components/home/Home';
import { FavPage } from './components/v2/Pages/FavPage';
import LandingPage from './components/v2/Pages/LandingPage';
import NotFoundPage from './components/v2/Pages/NotFoundPage';
import { subscribeUser } from './functions/subscribeUser';
import { AttractionPage } from './components/v2/Pages/Attractions/AttractionPage';
import { RestaurantPage } from './components/v2/Pages/Restaurants/RestaurantPage';
import Footer from './components/v2/Extras/Footer';
import { ShowPage } from './components/v2/Pages/Shows/ShowPage';

function App() {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(subscribeUser()).catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });

    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription();
    });

    if (Notification.permission === 'denied') {
      console.error('Notifications are blocked by the user.');
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  

  return (
    <Router basename="/">
      <div id='main-container' className="App">
        <Nav />
        <div style={{width: '100%', minHeight: 'calc(100vh - 60px)', height: '100%', backgroundColor: 'white'}}>
          <Routes>
            <Route path="/" exact element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/favs" element={<FavPage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/parks/:id" element={<ParkPage />} />
            <Route path="/attractions/:id" element={<AttractionPage />} />
            <Route path="/restaurants/:id" element={<RestaurantPage />} />  
            <Route path="/shows/:id" element={<ShowPage />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
