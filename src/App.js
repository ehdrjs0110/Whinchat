import './App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, { Component, useRef, useEffect, useState} from "react";

//Router
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Cookies} from 'react-cookie';


import Gpt from './front/Gpt';
import Chat from './front/Chat';
import Fr from './front/Fr';
import Main from './front/Main';
// import Navi from './react/Navi';
import Sign from './front/Sign';

//cookie
const cookies = new Cookies();

function App() {
  const [memberId, setMemberId] = useState(cookies.get('id'));
  // cookies.set("id","wodysl");
  return (
    <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Fr" element={<Fr />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/Gpt" element={<Gpt />} />
        </Routes>
      </BrowserRouter>
    </div>
  ); 
}
export default App;
