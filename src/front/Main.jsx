import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../css/Main.css';

const Main = () => {
    const URL = "http://localhost:3001/upload";
    const inputRef = useRef(null);
    var fileName = "";

    const [State, setState] = useState({
      name: "",
      pr: "",
    });
    const handle = (e) => {
      setState({
        ...State,
        [e.target.name]: e.target.value,
      });
    };
    const submitId = () => {
      const post = {
        name: State.name,
        pr: State.pr,
      };
    
      fetch("http://localhost:3001/profile", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.checked == true)
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
    const [file, setFile] = useState("");
    //이미지 업로드 변경
    const upload = () => {
        const formData = new FormData();
        formData.append('file', file);
        axios.post("http://localhost:3001/upload", formData)
        .then((res) => {
          console.log(res.data);
          fileName = res.data;
          console.log(fileName);
          setUploadedImg({
            fileName,
            filePath: `http://localhost:3000/main/${fileName}`,
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
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const handleAvatarClick = () => {
      // If not editing avatar, trigger file input click
      if (!isEditingAvatar && inputRef.current) {
        inputRef.current.click();
      }
      // Toggle the editing state
      setIsEditingAvatar(!isEditingAvatar);
    };
    const onChange = e => {
      setFile(e.target.files[0]);
      //이미지
      setIsEditingAvatar(false);
    };
  return (
    <>
<body>
  <div class="ChatContainer">
    <div class="row">
      <nav class="menu">
        <ul class="items">
          <li class="item item-active">
            <i class="fa fa-home" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-user" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-commenting" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-cog" aria-hidden="true"></i>
          </li>
        </ul>
      </nav>
              <div class="card-body">
              <form class="profile">
                 {uploadedImg ? (
                  <>
                    <img class="mainavatar" src={uploadedImg.filePath} alt="" onClick={handleAvatarClick} />
                    {/* <h3>{uploadedImg.fileName}</h3> */}
                  </>
                ) : (
                  ""
                )}
                    <img class="mainavatar" src={process.env.PUBLIC_URL +"/proimg/"+uploadedImg.fileName || "http://bootdey.com/img/Content/avatar/avatar1.png"} alt="Uploaded" onClick={handleAvatarClick} style={{ width: "230px", height: "230px" }} />
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
                  <input type="text" id="name" name="name" placeholder="닉네임을 입력하세요."  required onChange={handle}/>
              </div>
              <div className="main-input-field2">
                  <i className="fas fa-file"></i>
                  <input id="pr" name="pr" placeholder="자기 소개" onChange={handle}/>
              </div>
              <input type="button" value="수정" class="btn-btn-primary"onClick={submitId}/> 
                </div>
            </div>
        </div>
</body>
    </>
  );
};

export default Main;