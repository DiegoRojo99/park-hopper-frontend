import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function LandingPage() {
  return (
    <div className="landing-page">      
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Park Hopper</h1>
          <p>Your Ultimate Theme Park Companion</p>
          <Link to="/explore" className="cta-button">Explore Now</Link>
        </div>
      </header>
      
      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="steps">
            <div className="step">
              <h3>1. Search & Explore</h3>
              <p>Find attractions, shows, restaurants, and more.</p>
            </div>
            <div className="step">
              <h3>2. Add to Favorites</h3>
              <p>Easily track and manage your favorite places.</p>
            </div>
            <div className="step">
              <h3>3. Get Alerts</h3>
              <p>Set wait time alerts and get notified instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
