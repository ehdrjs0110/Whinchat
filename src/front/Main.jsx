import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import {Cookies} from 'react-cookie';
import axios from 'axios';

const cookies = new Cookies();

const Main = () => {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const inputRef = useRef(null);

    const [callname, setCallname] = useState("");
    const [callpr, setCallpr] = useState("");
    const [file, setFile] = useState("");

    var fileName = "";

    useEffect( () => {
      
    // const calldata = () => {
      const post = {
        id: cookies.get('id'),
      };

      if(cookies.get('id')==null){
        navigate('/Sign');
      }else{
      fetch("http://3.36.66.72:4000/Call", {
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
              setCallname(json.name);
              setCallpr(json.pr);
              setFile(json.img);
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
    // }
  }, [callname, callpr])
    
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

    //이미지 업로드 변경
    const upload = () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cookie', cookies.get('id'));
      console.log(cookies.get('id'));
      axios.post("http://3.36.66.72:4000/upload", formData)
      .then((res) => {
        console.log(res.data);
        fileName = res.data;
        console.log(fileName);
        setUploadedImg({
          fileName,
          filePath: `http://3.36.66.72:3000/main/${fileName}`,
        });
        alert(fileName);
      })
      .catch((err) => {
        console.error(err);
        alert('프로필 편집 실패');
      });
    }
    const [uploadedImg, setUploadedImg] = useState({
        fileName: "",
        filePath: "",
    });
    //아바타 이미지 선택
    const handleAvatarClick = () => {
      // If not editing avatar, trigger file input click
      if (!isEditingAvatar && inputRef.current) {
        inputRef.current.click();
      }
      // Toggle the editing state
      setIsEditingAvatar(!isEditingAvatar);
    };

    // const onChange = e => {
    //   setFile(e.target.files[0]);
    //   //이미지
    //   setIsEditingAvatar(false);
    // };

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
        <form class="profile">
              <img class="mainavatar" src={(file!==undefined) ? "/home/ubuntu/project/whinchat/public/proimg/"+file : "http://bootdey.com/img/Content/avatar/avatar1.png"} alt="Uploaded" onClick={handleAvatarClick} style={{ width: "230px", height: "230px" }} />
                {/* <h3>{fileName}</h3> */}
              <input 
                accept="image/*" 
                ref={inputRef} 
                type="file" 
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}/> 
                <h3>{}</h3>   
                <button class="btn-btn-primary" type="button" onClick={upload}>프로필 편집</button>
        </form>

        <div className="main-input-field">
        <i className="fas fa-user"></i>
        <input type="text" placeholder={ callname || "닉네임을 입력하세요."} id='name' name='name' onChange={handleProfile} required/>
        </div>
        <div className="main-input-field2">
          <i className="fas fa-file"></i>
          <input type="text" placeholder={ callpr || "자기소개를 적어주세요." } id='pr' name='pr' onChange={handleProfile} />
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