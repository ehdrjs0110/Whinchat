import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Sign from './front/Sign';
import Sign2 from './front/Sign_copy';
import ChatRoom from './front/ChatRoom';
import Profile from './front/Profile';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Sign2" element={<Sign2 />} />
          <Route path="/ChatRoom" element={<ChatRoom />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  ); 
}

export default App;
