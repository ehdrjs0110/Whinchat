import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import {Cookies} from 'react-cookie';
import axios from 'axios';
import io from 'socket.io-client';

const cookies = new Cookies();

const Main = () => {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const inputRef = useRef(null);

    const [callname, setCallname] = useState("");
    const [callpr, setCallpr] = useState("");
    const [file, setFile] = useState("");
    const [newfile, setnewFile] = useState("");

    var fileName = "";

    useEffect( () => {
      
    // const calldata = () => {
      const post = {
        id: cookies.get('id'),
      };

      if(cookies.get('id')==null){
        navigate('/Sign');
      }else{
      fetch("http://43.201.98.98:4000/Call", {
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
        fetch("http://43.201.98.98:4000/Profile", {
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
      if(newfile!=""){
        const formData = new FormData();
        formData.append('file', newfile);
        formData.append('cookie', cookies.get('id'));
        axios.post("http://43.201.98.98:4000/upload", formData)
        .then((res) => {
          console.log(res.data);
          fileName = res.data;
          console.log(fileName);
          setUploadedImg({
            fileName,
            filePath: `http://43.201.98.98:3000/main/${fileName}`,
          });
          alert("사진 변경 완료");
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert('프로필 편집 실패');
        });
      }else{
        alert('사진을 선택해주세요!');
      }
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

    const [robotColor, setRobotColor] = useState('#000');
    const [writeMessageBorderColor, setWriteMessageBorderColor] = useState('#000');

    function toggleRobotColor() {
        setRobotColor((prevColor) => (prevColor === '#000' ? '#3b6ff3' : '#000'));
        setWriteMessageBorderColor('#3b6ff3');
      }

      const [modalOpen, setModalOpen] = useState(false);
      const modalBackground = useRef();


    // -----------------------------------------------------------------------
    const [test, setTest] = useState();

    var socket = io.connect('http://localhost:8080', 
    {transports: ['websocket']});

    // let roomId, roomName, memberId;
    const [roomId, setRoomId] = useState();
    const [roomName, setRoomName] = useState();
    const [memberId, setMemberId] = useState(cookies.get('id'));

    //room, friends
    const [listRoom, setListRoom] = useState([]);
    const [listFriends, setListFriends] = useState([]);
    const [listFriendsIndex, setListFriendsIndex] = useState([]);
    const [room, setRoom] = useState(null);
    const [member, setMember] = useState({});
    const [inviteMember, setInviteMember] = useState([]);

    //room
    // const [time, setTime] = useState([]);
    // const [sender, setSender] = useState([]);
    // const [content, setContent] = useState([]);
    
    //input
    const inputId = useRef();
    const inputMessage = useRef();
    const inputFriendId = useRef();

    //div
    // const chatDiv = useRef();
    // const memberDiv = useRef();
    // const friendsDiv = useRef();

  //채팅방 socket 연결 해야함
  const loadRoom = (room_id, room_name) => {
    setRoomId(room_id);
    setRoomName(room_name);

    const url = 'http://localhost:3001/loadRoom';
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({memberId : memberId, roomId: room_id})
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data =>{
      console.log('Category Data:', data);
      setRoom(data.room);
      setMember(data.member);
      console.log(data.inviteMember);
      setInviteMember(data.inviteMember);
    })
    .catch(error => console.error('Error:', error));
    
    // inviteMap();
    socket.emit('loadRoom', room_id);
  }
  
  // const member_id = inputId.current.value;
  // setMemberId(member_id);
  
  
  useEffect( () => {
    // const login = () => {
      const url = 'http://localhost:3001/login';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({memberId : memberId})
      };
      
      fetch(url, options)
      .then(response => response.json())
      .then(data =>{
        if(data.member.room != null){
          setListRoom(data.member.room);
        }
        else{
          setListRoom(null);
        }
        
        if(data.member.friends != null){
          setListFriends(data.member.friends);
          const temp = [];
          for(var i=0 ; i<data.member.friends.length ; i++){
            const str = "friend" + i;
            temp[i] = str;
          }
          setListFriendsIndex(temp);
        }
        else{
          setListFriends(null);
        }
      })
      .catch(error => console.error('Error:', error));
    // }
    }, [memberId])
    
    const friend = async (data) => {
      alert(memberId);
      let friendId;
      
    let url = 'http://localhost:3001/friend';

    if(data.type === "add"){
      url += "Add";
      friendId = inputFriendId.current.value;
    }
    else if(data.type === "sub"){
      url += "Sub";
      friendId = data.friendId;
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberId : memberId, friendId : friendId})
    };
    
    fetch(url, options)
    .then(response => response.json())
    .then(member => {
      console.log(member.friends);
      // alert(member.friends);
      if(member.friends != null){
        setListFriends(member.friends);
      }
      else{
        setListFriends(null);
      }
    })
    .catch(error => console.error('Error:', error));
  }
  
  const friendChat = (friendId) => {
    const url = 'http://localhost:3001/friendChat';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberId : memberId, friendId : friendId})
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      //member, room
      if(data.member.room != null){
        setListRoom(data.member.room);
      }
      else{
        setListRoom(null);
      }

      setRoom(data.room);
      socket.emit('loadRoom', data.room.id);
    })
    .catch(error => console.error('Error:', error));
  }

  const joinRoom = () => {
    const url = 'http://localhost:3001/joinRoom';
    let room_id;

    //checkbox 표시
    const checkId = [];
    for(var i=0 ; i<listFriends.length ; i++){
      const str = "friend" + i;
      const checkBtn = document.getElementById(str);
      if(checkBtn.checked){
        checkId[i] = checkBtn.value;
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberId: memberId, checkId: checkId})
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      //member, room
      if(data.member.room != null){
        setListRoom(data.member.room);
      }
      else{
        setListRoom(null);
      }
      room_id = data.roomId;
      setRoomId(data.roomId);

      setRoom(data.room);
      setMember(data.member);
    })
    .catch(error => console.error('Error:', error));

    socket.emit('loadRoom',room_id);
  }

  const sendMessage = () => {
    alert(roomId);
    socket.emit('sendMessage', { id:memberId, roomId:roomId, message:inputMessage.current.value });
    inputMessage.current.value = null;
  }

  const leaveRoom = () => {
    socket.emit('leaveRoom', {roomId:roomId, id:memberId});
  }

  //join, load
  const inviteMap = () => {
    alert("invite");
    let temp = member.friends.id;
    
    for(var i=0 ; i<room.id.length ; i++){
      temp = temp.filter(item => item !== friend);
    }
    // alert("hh");


    // room.id.map((friend) => (
    //   temp = temp.filter(item => item !== friend)
    // ))
    setInviteMember(temp);
  }

  
  // function sendMessage() {
  //   socket.emit('sendMessage', { id:memberId, roomId:roomId, message:inputMessage.current.value });
  //   inputMessage.current.value = null;
  // }
  function invite(){
    const checkBtn = document.querySelectorAll(".checkBtn");
    alert(checkBtn.length);
    const flag = [];
    const idList = [];
    for(var i=0 ; i<checkBtn.length ; i++){
        const id = "friend" + i;
        if(document.getElementById(id).checked){
            alert("flag");
            flag[i] = 1;
            idList[i] = checkBtn[i].value;
        }
    }
    alert(roomId);
    //socket.emit('invite', {flag:flag, id:memberId, roomId:roomId, roomName: roomName});
    socket.emit('invite', {idList:idList, id:memberId, roomId:roomId, roomName: roomName});
  }



  //socket
  socket.on('join', (data) => {
    //roomId
    setRoomId(data.roomId);
    setRoomName(data.roomName);

    // alert(data.member.room);
    setListRoom(data.member.room);

    setRoom(data.room);
  });
  
  socket.on('message', (data) => {
    alert("hhh");
    setRoom(data.room);
    setListRoom(data.member.room);
  });

  socket.on('load', (data) => {
    alert(data);
  });

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
            <i class="fa fa-user" aria-hidden="true" onClick={fhandleClick}>
            </i>
          </li>
          <li class="item">
            <i class="fa fa-pencil" aria-hidden="true" onClick={() => setModalOpen(true)}></i>
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
      {
        modalOpen &&
        <div className={'modal-container'} ref={modalBackground} onClick={e => {
          if (e.target === modalBackground.current) {
            setModalOpen(false);
          }
        }}>
          <div className={'modal-content'}>
            <p>친구 목록</p>
            <div className="friends">
              {/* 친구 목록 출력 */}
              {listFriends != null &&
              listFriends.map((friends, index) => (
                <div key={friends.id}>
                  <label htmlFor={index}>{friends.name}</label>
                  <input type="checkbox" id={"friend"+index} value={friends.id} />
                  {/* <span><strong>{friends.name}</strong></span> */}
                  {/* <button onClick={() => friendChat(friends.id)}>채팅</button> */}
                  {/* <button onClick={() => friend("sub")}>삭제</button> */}
                  {/* <button onClick={() => friend({type:"sub", friendId:friends.id})}>삭제</button> */}
                  {/* <br/> */}
                </div>
              ))
            }
            </div>
            <button className='modal-close-btn' onClick={() => setModalOpen(false)}>닫기</button>
            <button className='modal-close-btn' onClick={joinRoom}>방 생성</button>  {/* 초대랑 삭제버튼은 없애고 위에 친구 목록 출력 안에 넣으삼 */}
            {/* <button className="">삭제</button> */}
          </div>
        </div>
        
      }
      <div class="card-body">
        <form class="profile">
              <img class="mainavatar" src={(file!==undefined) ? process.env.PUBLIC_URL+"/proimg/"+file : "http://bootdey.com/img/Content/avatar/avatar1.png"} alt="Uploaded" onClick={handleAvatarClick} style={{ width: "230px", height: "230px" }} />
                {/* <h3>{fileName}</h3> */}
              <input 
                accept="image/*" 
                ref={inputRef} 
                type="file" 
                style={{ display: 'none' }}
                onChange={(e) => setnewFile(e.target.files[0])}/>  
                <button class="btn-btn-primary" type="button" onClick={upload}>사진 변경</button>
        </form>

        <div className="main-input-field">
        <i className="fas fa-user"></i>
        <input type="text" placeholder={ callname || "닉네임을 입력하세요."} id='name' name='name' onChange={handleProfile} required/>
        </div>
        <div className="main-input-field2">
          <i className="fas fa-file"></i>
          <input type="text" placeholder={ callpr || "자기소개를 적어주세요." } id='pr' name='pr' onChange={handleProfile} />
        </div>
        <button class="btn-btn-primary" type="button" onClick={submitProfile}>프로필 변경</button>
      </div>
    </div>
  </div>
</body>
    </>
  );
};

export default Main;