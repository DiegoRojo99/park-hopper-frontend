import './App.css';
import Nav from './components/nav/Nav';
import Destinations from './components/destinations/Destinations';
import DestinationDetails from './components/destinations/DestinationDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AttractionDetails } from './components/destinations/AttractionDetails';
import { WaitingTimes } from './components/destinations/WaitingTimes';
import LoginRegister from './components/login/LoginRegister';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import ExplorePage from './components/v2/Explore/ExplorePage';
import { ParkPage } from './components/pages/ParkPage';
import Home from './components/home/Home';

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
    <BrowserRouter>
      <div id='main-container' className="App">
        <Nav />
        <div style={{width: '100%', height: '100%'}}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/destinations/:id/waiting" element={<WaitingTimes type={'destinations'} />} />
            <Route path="/parks/:id" element={<ParkPage />} />            
            <Route path="/parks/:id/waiting" element={<WaitingTimes type={'park'} />} />
            <Route path="/attractions/:id" element={<AttractionDetails />} />
            {/* <Route path="/destinations/:id" element={<DestinationCalendar />} /> */}
          
            {/* <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
            
            <Route path="/login" element={<LoginRegister />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
