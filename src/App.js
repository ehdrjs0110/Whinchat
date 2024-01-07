import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Sign from './front/Sign';
import Main from './front/Main';
import Chat from './front/Chat';
import Fr from './front/Fr';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Fr" element={<Fr />} />
          <Route path="/Main" element={<Main />} />
        </Routes>
      </Router>
    </div>
  ); 
}

export default App;
