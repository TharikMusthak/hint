import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './HeroSection.jsx'; // அல்லது நீங்கள் HeroSection.jsx என்று வைத்திருந்தால் அதைப் போடவும்
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);