import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Main.css';
import {Cookies} from 'react-cookie';


const Main = () => {
  const cookies = new Cookies();
  
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const inputRef = useRef(null);
  
    const handleAvatarClick = () => {
      // If not editing avatar, trigger file input click
      if (!isEditingAvatar && inputRef.current) {
        inputRef.current.click();
      }
      // Toggle the editing state
      setIsEditingAvatar(!isEditingAvatar);
    };
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      // Handle the selected file as needed
      console.log('Selected image:', file);
      // Reset state after handling the image if needed
      setIsEditingAvatar(false);
    };
    //로그아웃
    const logout = () => {
      cookies.remove('id');
      navigate('/Main');
    }


    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/Chat');
    }
    const mhandleClick = () => {
      navigate('/Main');
    }
    const fhandleClick = () => {
      navigate('/Fr');
    }

    

  return (
    <>
<body>
  <div class="ChatContainer">
    <div class="row">
      <nav class="menu">
        <ul class="items">
          <li class="item item-active">
            <i class="fa fa-home" aria-hidden="true" onClick={mhandleClick}></i>
          </li>
          <li class="item">
            <i class="fa fa-user" aria-hidden="true" onClick={fhandleClick} ></i>
          </li>
          <li class="item">
            <i class="fa fa-commenting" aria-hidden="true" onClick={handleClick}></i>
          </li>
          <li class="item">
            <button onClick={logout}>  {/* 로그아웃 버튼 */}
          <i class="fa-solid fa-right-from-bracket fa-2x" aria-hidden="true"></i>
          </button>
          </li>
        </ul>
      </nav>
              <div class="card-body">
                    <img class="mainavatar" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt=""  onClick={handleAvatarClick}/>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={inputRef}
                  />

              <div className="main-input-field">
                  <i className="fas fa-user"></i>
                  <input type="text" placeholder="닉네임을 입력하세요." required/>
              </div>

              <div className="main-input-field2">
                  <i className="fas fa-file"></i>
                  <input type="text" placeholder="자기소개를 적어주세요."/>
              </div>
                <button class="btn-btn-primary" type="button">제출</button>
                </div>
            </div>
        </div>
</body>
    </>
  );
};

export default Main;