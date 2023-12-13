import '../css/Sign.css';
import Snowfall from 'react-snowfall';

import '@fortawesome/fontawesome-free/css/all.min.css'; // 아이콘 임포트
import React, { Component, useRef, useEffect, useState} from "react";

// mongoose.connect('mongodb+srv://honghwarang:45fkd62dus@cluster0.sti7z1m.mongodb.net/?retryWrites=true&w=majority',{
//     useNewUrlParser : true, useUnifiedTopology : true
// }).then(()=>console.log("MongoDB Connect"))
//     .catch(err=>console.log(err))

// mongoose.set('strictQuery', true);

  
import {Cookies} from 'react-cookie';

function Sign() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [loginState, setLoginState] = useState({
    id: "",
    pwd: "",
  });

  const [signState, setSignState] = useState({
    id: "",
    pwd: "",
  });

  const handleSign = (e) => {
    setSignState({
      ...signState,
      [e.target.name]: e.target.value,
    });
  };

  const submitId2 = () => {
    const post = {
      id: signState.id,
      pwd: signState.pwd,
    };

    console.log('Request Body:', signState.id);  // 클라이언트 콘솔 로그 추가

    fetch("http://3.36.66.72:4000/SignUp", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('Server Response:', json);  // 클라이언트 콘솔 로그 추가
        if (json.success == true)
        {
          alert("회원가입 성공");

        } else{
          alert("다시 입력해주세요.")
        }      
        setSignState({
          ...signState,
          message: json.message,
        });
      })
      .catch((error) => {
        console.error('Fetch Error:', error);  // 클라이언트 콘솔 로그 추가
        setSignState({
          ...signState,
          message: error.message,
        });
      });
  }

  const handleLogin = (e) => {
    setLoginState({
      ...loginState,
      [e.target.name]: e.target.value,
    });
  };

  const submitId = () => {
    const post = {
      id: loginState.id,
      pwd: loginState.pwd,
    };

    fetch("http://3.36.66.72:4000/SignIn", {
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
          //alert("로그인 성공")
          //세션 설정
          cookies.set("id", loginState.id);
          navigate('/ChatRoom');

        } else{
          alert("아이디 또는 비밀번호가 틀렸습니다.")
        }      
        setLoginState({
          ...loginState,
          message: json.message,
        });
      })
      .catch((error) => {
        setLoginState({
          ...loginState,
          message: error.message,
        });
      });
  };

// ------------------------------------------------------------------------------------------

const [isSignUpMode, setIsSignUpMode] = useState(false);

const uphandleClick = () => {
  // Sign Up 버튼 클릭 시 상태를 토글
  setIsSignUpMode(true);
};

const inhandleClick = () => {
  // Sign In 버튼 클릭 시 상태를 토글
  setIsSignUpMode(false);
};

    // 클릭하면 container 클래스가 container sign-up-mode로 클래스 이름으로 바껴야됨

    const backgroundArr = ["img1","img2", "img3", "img4", "img5"]; 
    const randomIndex = Math.floor(Math.random() * backgroundArr.length);
    const backgroundImg = backgroundArr[randomIndex];

  return (
      <div className={`container ${backgroundImg}  ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
            <div className="signin-signup">
                <form action="" className="sign-in-form">
                    <h2 className="title">Sign in</h2>
              <p>{cookies.get("id")}</p>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="Username" />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Password" />
                    </div>
                    <input type="submit" value="Login" className="btn solid"/>

                    <p className="social-text">다른 계정으로 로그인</p>
                    <div className="social-media">
                        <a href="#" className="social-icon">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </form>

                <form action="" className="sign-up-form" >
                    <h2 className="title">Sign up</h2>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="Username" />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Password"  />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Re_Password" />
                    </div>
                    <input type="submit" value="Login" className="btn solid"/>

                    <p className="social-text">다른계정으로 로그인</p>
                    <div className="social-media">
                        <a href="#" className="social-icon">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>  

        <div className="panels-container">
        <div className="panel left-panel">
            {/* <image src="/image/wood.jpg" alt="img1" className='image' /> */}
                <div className="content">
                    <h3>계정이 없으신가요 ?</h3>
                    <p>계정이 없으시다면 간단한 회원가입으로 채팅 서비스를 누려보세요 !</p>
                    <button className="btn transparent" id="sign-up-btn" onClick={uphandleClick} >Sign up</button>
                </div>

            </div>

            <div className="panel right-panel">
                <div className="content">
                    <h3>이미 계정이 있으신가요 ?</h3>
                    <p>로그인하여 채팅 서비스를 무료로 누리세요 !</p>
                    <button className="btn transparent" id="sign-in-btn" onClick={inhandleClick} >Sign in</button>
                </div>

                
                
            <Snowfall
              snowflakeCount={100}
              fallSpeed={0.75}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />

            </div>
        </div>
    </div>
  ); 
}
export default Sign;
