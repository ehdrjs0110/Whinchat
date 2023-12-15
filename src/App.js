// import './App.css';
// import React from "react";
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// import Sign from './front/Sign';
// import Chat from './front/Chat';
// import Main from './front/Main';
// import Fr from './front/Fr';

// function App() {
//   return (
//     <div className="App">
//     <Router>
//         <Routes>
//           <Route path="/Sign" element={<Sign />} />
//           <Route path="/Chat" element={<Chat />} />
//           <Route path="/Fr" element={<Fr />} />
//           <Route path="/Main" element={<Main />} />
//         </Routes>
//       </Router>
//     </div>
//   ); 
// }

// export default App;


import './App.css';
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

          <Route path="/gpt" element={<Gpt />} />
          <Route path="/sign" element={<Sign />} />
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/fr" element={<Fr />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  ); 
}
export default App;
