
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/Chat.css';
import {Cookies} from 'react-cookie';

const Chat = () => {
  const cookies = new Cookies();
  

    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/Fr');
    }
    const mhandleClick = () => {
      navigate('/Main');
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
      inviteMap();
    })
    .catch(error => console.error('Error:', error));

    socket.emit('loadRoom', room_id);
  }
  
  // const login = () => {
    useEffect( () => {
      
    // const member_id = inputId.current.value;
    // setMemberId(member_id);

    //쿠키에 값 넣기(key, value)
    // cookies.set("id",member_id);

    //쿠키에 값 빼기(key)
    // cookies.get('id');

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
      }
      else{
        setListFriends(null);
      }
    })
    .catch(error => console.error('Error:', error));
  // }
  })

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

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberId: memberId})
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
      inviteMap();
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
  
  //로그아웃
  const logout = () => {
    cookies.remove('id');
    navigate('/Main');
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
          <li class="item">
            <i class="fa fa-home" aria-hidden="true" onClick={mhandleClick}></i>
          </li>
          <li class="item">
            <i class="fa fa-user" aria-hidden="true" onClick={handleClick}>
            </i>
          </li>
          <li class="item">
            <i class="fa fa-pencil" aria-hidden="true" onClick={() => setModalOpen(true)}></i>
            {/* <i class="fa fa-pencil" aria-hidden="true" onClick={() => setModalOpen(true)}><button onClick={joinRoom}>방 생성</button> </i> */}
          </li>
          <li class="item item-active">
            <i class="fa fa-commenting" aria-hidden="true"></i>
          </li>
          <li class="item">
            <button onClick={logout}>  {/* 로그아웃 버튼 */}
          <i class="fa-solid fa-right-from-bracket fa-2x" aria-hidden="true"></i>
          </button>
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
            <div className="frends">
              {/* 친구 목록 출력 */}
              {listFriends != null &&
                listFriends.map((friends) => (
                  <div key={friends.id}>
                    <span><strong>{friends.name}</strong></span>
                    <button onClick={() => friendChat(friends.id)}>채팅</button>
                    {/* <button onClick={() => friend("sub")}>삭제</button> */}
                    <button onClick={() => friend({type:"sub", friendId:friends.id})}>삭제</button>
                    <br/>
                  </div>
                ))
              }
            </div>
            <button className='modal-close-btn' onClick={() => setModalOpen(false)}>닫기</button>
            <button onClick={joinRoom}>방 생성</button>  {/* 초대랑 삭제버튼은 없애고 위에 친구 목록 출력 안에 넣으삼 */}
            <button className="">삭제</button>
          </div>
        </div>
      }
      <section class="discussions">
        <div class="discussion search">
          <div class="searchbar">
            <button>  {/* 채팅방 검색 */}
            <i class="fa fa-search" aria-hidden="true"></i>
            </button>
            <input type="text" id="chatsearch" placeholder="검색"></input>
          </div>
        </div>

          {/* 채팅방 목록 출력 */}
        {listRoom != null &&
          listRoom.map((room) => (
            <div class="discussion message" key={room.id}>
              <button id="chatBtn" onClick={() => loadRoom(room.id, room.name)}>{room.name}</button>
            </div>
          ))
        }
        {/* <div class="discussion message">
          
        </div> */}
      </section>

      <section class="chat">
        <div class="header-chat">
          <i class="icon fa fa-user-o" aria-hidden="true"></i>
          <p class="name" >대화 상대 이름</p> {/* p태그 사이에 유저아이디 변수명 불러오삼 */}
          <i class="fa fa-xmark fa-2x"></i>
        </div>

        {/* <div class="messages-chat"> */}
        <div class="wrap">
        {room != null &&
          room.log.map((log) => (
            // <div class="wrap">
              <div class="chat ch1">
                  <div class="icon"><i class="fa-solid fa-user"></i></div>
                  <div>{log.sender}</div>
                  <div class="textbox">{log.content}</div>
              </div>
            // </div>
          ))
        }
        {/* <p key={log.time}>[{log.time}] <strong>{log.sender} :</strong> {log.content} </p> */}
          {/* 대화 내용 출력 */}
          {/* id : <input type="text" id="memberId" ref={inputId}/> <button onClick={login}>로그인</button> */}
        </div>
         
        <div class="footer-chat">
        <i class="fas fa-plus" id="plusicon" aria-hidden="true"></i>
          <input type="text" ref={inputMessage} class="write-message" placeholder="메세지를 입력해주세요." style={{ borderColor: writeMessageBorderColor }}/>
          <i onClick={sendMessage} class="fa fa-paper-plane" aria-hidden="true"></i>
          <i class="fas fa-robot" aria-hidden="true" style={{ color: robotColor }} onClick={toggleRobotColor} ></i>
        </div>
        {/* <div class="footer-chat">
          <i class="fas fa-plus" id="plusicon" aria-hidden="true"></i> */}


          {/* <input type="text" id="message" ref={inputMessage}/>
      <button onClick={sendMessage}>보내기</button> */}


          {/* <input type="text" ref={inputMessage} class="write-message" placeholder="메세지를 입력해주세요." style={{ borderColor: writeMessageBorderColor }}/>
          <i onClick={sendMessage} class="fa fa-paper-plane" aria-hidden="true"></i>
          <i class="fas fa-robot" aria-hidden="true" style={{ color: robotColor }} onClick={toggleRobotColor} ></i>
        </div> */}
      </section>
    </div>
      
  </div>
</body>

    </>
  );
};

export default Chat;