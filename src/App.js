import './App.css';
import Nav from './components/nav/Nav';
import Destinations from './components/destinations/Destinations';
import DestinationDetails from './components/destinations/DestinationDetails';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AttractionDetails } from './components/destinations/AttractionDetails';
import LoginRegister from './components/login/LoginRegister';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import ExplorePage from './components/v2/Explore/ExplorePage';
import { ParkPage } from './components/v2/Pages/ParkPage';
import Home from './components/home/Home';
import { FavPage } from './components/v2/Pages/FavPage';
import LandingPage from './components/v2/Pages/LandingPage';

function App() {
  
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
      } else {
        // console.log("user is logged out")
      }
    });
  }, [])

  return (
    <Router basename="/">
      <div id='main-container' className="App">
        <Nav />
        <div style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
          <Routes>
            <Route path="/" exact element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/favs" element={<FavPage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/parks/:id" element={<ParkPage />} />            
            <Route path="/attractions/:id" element={<AttractionDetails />} />            
            <Route path="/login" element={<LoginRegister />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
