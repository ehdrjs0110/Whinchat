
import React, { useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const Chat = () => {

    const [robotColor, setRobotColor] = useState('#000');
    const [writeMessageBorderColor, setWriteMessageBorderColor] = useState('#000');

    function toggleRobotColor() {
        setRobotColor((prevColor) => (prevColor === '#000' ? '#3b6ff3' : '#000'));
        setWriteMessageBorderColor('#3b6ff3');
      }


    // -----------------------------------------------------------------------
    var socket = io.connect('http://localhost:8080', 
        {transports: ['websocket']});

    //const urlParams = new URLSearchParams(window.location.search);
    //const roomName = urlParams.get('room');
    let roomName;
    let memberId;

    //
    function loadRoom() {
        //roomName = document.getElementById('roomId').value;
        socket.emit('loadRoom', roomName);
    }
    
    function loadMember(roomId){
        roomName = roomId;
        socket.emit('loadRoom', roomId);
    }

    function login(){
        memberId = document.getElementById("memberId").value;

        alert(`${memberId} 로그인 성공`)
        socket.emit('member', memberId);
    }

    function joinRoom() {
        socket.emit('joinRoom', memberId);
    }

    function sendMessage() {
        console.log("send roomName:",roomName);
        console.log("send id : ", memberId);
        const message = document.getElementById('message').value;
        socket.emit('sendMessage', { id:memberId, roomName:roomName, message:message  });
    }

    function leaveRoom() {
        socket.emit('leaveRoom', {roomName:roomName, id:"wodysl"});
    }

    socket.on('join', (data) => {
        //roomName
        roomName = data.roomName;

        const chatDiv = document.getElementById('chat');
        chatDiv.innerHTML = '';
        chatDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.text}  ${data.time} </p>`;
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    socket.on('message', (data) => {
        const chatDiv = document.getElementById('chat');
        chatDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.text}   ${data.time}</p>`;
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    socket.on('load', (data) => {
        console.log(data);
        const chatDiv = document.getElementById('chat');
        chatDiv.innerHTML = '';
        for(var i=0 ; i<data.sender.length ; i++){
            chatDiv.innerHTML += `<p><strong>${data.sender[i]}:</strong> ${data.content[i]}  ${data.time[i]}</p>`;
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    });

    socket.on('member', (data) => {
        const chatDiv = document.getElementById('member');
        chatDiv.innerHTML = '';
        for(var i=0 ; i<data.room.length ; i++){
            chatDiv.innerHTML += `<button onclick="loadMember('${data.room[i].id}')">${data.room[i].id}:${data.room[i].name}</button>`;
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    });
  return (
    <>
<body>
  <div class="ChatContainer">
    <div class="row">
      <nav class="menu">
        <ul class="items">
          <li class="item">
            <i class="fa fa-home" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-user" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </li>
          <li class="item item-active">
            <i class="fa fa-commenting" aria-hidden="true"></i>
          </li>
          <li class="item">
            <i class="fa fa-cog" aria-hidden="true"></i>
          </li>
        </ul>
      </nav>

      <section class="discussions">
        <div class="discussion search">
          <div class="searchbar">
            <i class="fa fa-search" aria-hidden="true"></i>
            <input type="text" id="chatsearch" placeholder="검색"></input>
          </div>
        </div>
        <div class="discussion message-active">
          <div class="photo" >
            <div class="online"></div>
          </div>
          <div class="desc-contact">
            <p class="name">손흥민</p>
            <p class="message">화랑아 보고싶어</p>
          </div>
          <div class="timer">12초 전</div>
        </div>

        <div class="discussion">
          <div class="photo" >
            <div class="online"></div>
          </div>
          <div class="desc-contact">
            <p class="name">Dave Corlew</p>
            <p class="message">Let's meet for a coffee or something today ?</p>
          </div>
          <div class="timer">3 min</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Jerome Seiber</p>
            <p class="message">I've sent you the annual report</p>
          </div>
          <div class="timer">42 min</div>
        </div>

        <div class="discussion">
          <div class="photo" >
            <div class="online"></div>
          </div>
          <div class="desc-contact">
            <p class="name">Thomas Dbtn</p>
            <p class="message">See you tomorrow ! 🙂</p>
          </div>
          <div class="timer">2 hour</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Elsie Amador</p>
            <p class="message">What the f**k is going on ?</p>
          </div>
          <div class="timer">1 day</div>
        </div>
        
        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Elsie Amador</p>
            <p class="message">What the f**k is going on ?</p>
          </div>
          <div class="timer">1 day</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Elsie Amador</p>
            <p class="message">What the f**k is going on ?</p>
          </div>
          <div class="timer">1 day</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Elsie Amador</p>
            <p class="message">What the f**k is going on ?</p>
          </div>
          <div class="timer">1 day</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Elsie Amador</p>
            <p class="message">What the f**k is going on ?</p>
          </div>
          <div class="timer">1 day</div>
        </div>

        <div class="discussion">
          <div class="photo" >
          </div>
          <div class="desc-contact">
            <p class="name">Billy Southard</p>
            <p class="message">Ahahah 😂</p>
          </div>
          <div class="timer">4 days</div>
        </div>

        <div class="discussion">
          <div class="photo" >
            <div class="online"></div>
          </div>
          <div class="desc-contact">
            <p class="name">Paul Walker</p>
            <p class="message">You can't see me</p>
          </div>
          <div class="timer">1 week</div>
        </div>
      </section>

      <section class="chat">
        <div class="header-chat">
          <i class="icon fa fa-user-o" aria-hidden="true"></i>
          <p class="name" >대화 상대 이름</p>
          <i class="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
        </div>
        <div class="messages-chat">
          <div class="message">
            <div class="photo" >
              <div class="online"></div>
            </div>
            <p class="text"> 대화 내용 1 </p>
          </div>
          <div class="message text-only">
            <p class="text"> 대화 내용 2</p>
          </div>
          <p class="time"> 14시 50분</p>
          <div class="message text-only">
            <div class="response">
              <p class="text"> 대화 내용 3</p>
            </div>
          </div>
          <div class="message text-only">
            <div class="response">
              <p class="text"> 대화 내용 4</p>
            </div>
          </div>
          <p class="response-time time"> 14시 55분</p>
          <div class="message">
            <div class="photo" >
              <div class="online"></div>
            </div>
            <p class="text"> 대화 내용 5</p>
          </div>
          <p class="time"> 15시 30분</p>
        </div>
        <div class="footer-chat">
          <i class="fas fa-plus" id="plusicon" aria-hidden="true"></i>
          <input type="text" class="write-message" placeholder="메세지를 입력해주세요." style={{ borderColor: writeMessageBorderColor }} ></input>
          <i class="fa fa-paper-plane" aria-hidden="true"></i>
          <i class="fas fa-robot" aria-hidden="true" style={{ color: robotColor }}
              onClick={toggleRobotColor} ></i>
        </div>
      </section>
    </div>
  </div>
</body>
    </>
  );
};

export default Chat;