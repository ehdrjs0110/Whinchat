
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/Chat.css';
import {Cookies} from 'react-cookie';

const cookies = new Cookies();
const cookieId = cookies.get('id');

const Chat = () => {

    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/chat');
    }
    const mhandleClick = () => {
      navigate('/main');
    }
    const fhandleClick = () => {
      navigate('/fr');
    }
  

    const [robotColor, setRobotColor] = useState('#000');
    const [writeMessageBorderColor, setWriteMessageBorderColor] = useState('#000');

    function toggleRobotColor() {
        setRobotColor((prevColor) => (prevColor === '#000' ? '#3b6ff3' : '#000'));
        setWriteMessageBorderColor('#3b6ff3');

        
        
      }

      const [answer, setAnser] = useState("");

      const getGPTsQuery = () => {

        // var gpt_q = document.getElementById("gpt_q").value;
        var gpt_q = inputMessage.current.value;

        const url = 'http://43.201.98.98:3001/gpt';
        const gpt_q_json = {query: gpt_q};
        
        if (gpt_q_json.gpt_q !== "" && gpt_q_json.gpt_category !== "") {
            const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(gpt_q_json)
              };
    
              fetch(url, options)
              .then(response => response.text())
              .then(data => {
                console.log(data);
                setAnser(data)})
              .catch(error => console.error('Error:', error));
              
            }
        };

      const [modalOpen, setModalOpen] = useState(false);
      const modalBackground = useRef();


    // -----------------------------------------------------------------------
    const [test, setTest] = useState();

    var socket = io.connect('http://43.201.98.98:8088', 
    {transports: ['websocket']});

    // let roomId, roomName, memberId;
    const [roomId, setRoomId] = useState();
    const [roomName, setRoomName] = useState();
    const [memberId, setMemberId] = useState();

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
    const chatScroll = useRef(null);

    //div
    // const chatDiv = useRef();
    // const memberDiv = useRef();
    // const friendsDiv = useRef();






  //로그아웃
  // const logout = () => {
  //   cookies.remove('id');
  // }

  //채팅방 socket 연결 해야함
  const loadRoom = (room_id, room_name) => {
    setRoomId(room_id);
    setRoomName(room_name);

    const url = 'http://43.201.98.98:3001/loadRoom';
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
  
  
  
  useEffect( () => {
    const login = () => {
      const member_id = cookieId;
      setMemberId(member_id);
      const url = 'http://43.201.98.98:3001/login';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({memberId : member_id})
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
    }

    login();

  }, [memberId])

  //room이 변경될 때마다 스크롤 실행
  useEffect(() => {
    chatScroll.current.scrollIntoView({ behavior: 'smooth' });
  }, [room]);
    
    const friend = async (data) => {
      // alert(memberId);
      let friendId;
      
    let url = 'http://43.201.98.98:3001/friend';

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
    const url = 'http://43.201.98.98:3001/friendChat';

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
    const url = 'http://43.201.98.98:3001/joinRoom';
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
    // alert(roomId);
    socket.emit('sendMessage', { id:memberId, roomId:roomId, message:inputMessage.current.value });
    inputMessage.current.value = null;

    chatScroll.current.scrollIntoView({ behavior: 'smooth' });
  }

  const leaveRoom = () => {
    socket.emit('leaveRoom', {roomId:roomId, id:memberId});
  }

  //join, load
  const inviteMap = () => {
    // alert("invite");
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
    // alert("hhh");
    setRoom(data.room);
    setListRoom(data.member.room);
  });

  socket.on('load', (data) => {
    // alert(data);
  });
  

  return (
    <>
<body>
  
  <div class="ChatContainer">
    {/* <button onClick={login}>버튼</button> */}
    
    <div class="row">

    <nav class="menu">
        <ul class="items">
          <li class="item" onClick={mhandleClick}>
            <i class="fa fa-home" aria-hidden="true"></i>
          </li>
          <li class="item" onClick={fhandleClick}>
            <i class="fa fa-user" aria-hidden="true">
            </i>
          </li>
          <li class="item" onClick={() => setModalOpen(true)}>
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </li>
          <li class="item item-active" onClick={handleClick}>
            <i class="fa fa-commenting" aria-hidden="true"></i>
          </li>
          {/* 로그아웃 버튼 */}
          <li class="item" onClick={logout}>
            <i class="fa fa-right-from-bracket" aria-hidden="true"></i>
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
        <button onClick={leaveRoom}>나가기</button>
          <i class="icon fa fa-user-o" aria-hidden="true"></i>
          <p>채팅방</p>
          <i class="fa fa-xmark fa-2x"></i>
        </div>

        <div class="messages-chat" ref={chatScroll}>
        {room != null &&
          room.log.map((log) => (
            <p key={log.time}><strong>{log.sender} </strong> [{log.time}] <span>{log.content}</span> </p>
          ))
        }
          {/* 대화 내용 출력 */}
        </div>
         
        <div class="footer-chat">
        <i class="fas fa-plus" id="plusicon" aria-hidden="true"></i>
          <input type="text" ref={inputMessage} class="write-message" placeholder="메세지를 입력해주세요." style={{ borderColor: writeMessageBorderColor }}/>
          {robotColor === "#3b6ff3"&&
            <i onClick={getGPTsQuery} class="fa fa-paper-plane" aria-hidden="true"></i>
          }
          {robotColor === "#000"&&
          <i onClick={sendMessage} class="fa fa-paper-plane" aria-hidden="true"></i>

          }
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