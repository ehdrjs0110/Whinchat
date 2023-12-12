import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Sign from './front/Sign';
import Chat from './front/Chat';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  ); 
}

export default App;
