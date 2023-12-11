import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Sign from './front/Sign';
import ChatRoom from './front/ChatRoom';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/ChatRoom" element={<ChatRoom />} />
        </Routes>
      </Router>
    </div>
  ); 
}

export default App;
