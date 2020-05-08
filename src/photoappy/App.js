import React from 'react';
import logo from '../camera.png';
import '../App.css';
import PhotoApp from './photoFetcher'
require('dotenv').config();


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {<PhotoApp
            appId={process.env.REACT_APP_ACCESS_KEY}
        />}
      </header>
    </div>
  );
}

export default App;
