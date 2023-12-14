import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Sign from './front/Sign';
import Profile from './front/Profile';
import Main from './front/Main';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Main" element={<Main />} />
        </Routes>
      </Router>
    </div>
  ); 
}

export default App;
