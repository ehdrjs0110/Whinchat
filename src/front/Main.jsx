import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import {Cookies} from 'react-cookie';

const cookies = new Cookies();

const Main = () => {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const inputRef = useRef(null);

    const callname = "", callpr = ""; 

    if(cookies.get('id')==null){
      navigate('/Sign');
    }else{
    fetch("http://3.36.66.72:4000/Call", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(cookies.get('id')),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.cheked == true)
          {
            callname = json.name;
            callpr = json.pr
          } else{
            alert("프로필 가져오기 실패")
          }      
          setState({
            ...State,
            message: json.message,
          });
        })
        .catch((error) => {
          setState({
            ...State,
            message: error.message,
          });
        });
      }

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
      navigate('/Sign');
    }

    //프로필 변경
    const [State, setState] = useState({
      name: "",
      pr: "",
    });

    const handleProfile = (e) => {
      setState({
        ...State,
        [e.target.name]: e.target.value,
      });
    };

    const submitProfile = () => {
      const post = {
        name: State.name,
        pr: State.pr,
        id: cookies.get('id'),
      };

      if(cookies.get('id')==null){
        navigate('/Sign');
      }else{
        fetch("http://3.36.66.72:4000/Profile", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(post),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.cheked == true)
          {
            alert("프로필 변경 성공")
  
          } else{
            alert("프로필 변경 실패")
          }      
          setState({
            ...State,
            message: json.message,
          });
        })
        .catch((error) => {
          setState({
            ...State,
            message: error.message,
          });
        });
      }    
    };


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
          {/* 로그아웃 버튼 */}
          <li class="item" onClick={logout}>
            <i class="fa-solid fa-right-from-bracket fa-2x" aria-hidden="true"></i>
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
                  <input type="text" placeholder="닉네임을 입력하세요." id='name' name='name' onChange={handleProfile} value={callname} required/>
              </div>

              <div className="main-input-field2">
                  <i className="fas fa-file"></i>
                  <input type="text" placeholder="자기소개를 적어주세요." id='pr' name='pr' onChange={handleProfile} value={callpr}/>
              </div>
                <button class="btn-btn-primary" type="button" onClick={submitProfile}>제출</button>
                </div>
            </div>
        </div>
</body>
    </>
  );
};

export default Main;