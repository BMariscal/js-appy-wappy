import React from 'react';
import logo from '../camera.png';
import '../Blog.css';
require('dotenv').config();


function Blog() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

      </header>
    </div>
  );
}

export default Blog;