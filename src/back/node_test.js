

const {joinChat, updateChat, leaveChat, findChat, findMember, friendAdd, inviteChat, inviteMember, friendSub, friendChat} = require('./socket_db.js');

const { spawn } = require('child_process');
const iconv  = require('iconv-lite');

// import session from 'express-session';
// import cookieParser from 'cookie-parser';

// import express from 'express';

// import crypto from 'crypto';

// import dotenv from 'dotenv';

// node_test.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 3001;

//CORS 해결
const cors = require("cors");
app.use(cors());

// body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // JSON 형식의 body 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 형식의 body 파싱
app.use(express.static('public'));

const mongoose = require('mongoose');

const User = mongoose.model('collection',{
  id: String,
  pwd: String
});

// 데이터베이스와 컬렉션 이름
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1:16045";
 
const dbName = 'whinchat';
const collectionName = 'member';

const client = new MongoClient(uri, {
serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
}
});
const database = client.db(dbName);
const collection = database.collection(collectionName);


app.listen(port, function () {
  console.log("mongo.js 서버 port: 3001");
});

const test_gpt = (gpt_q) => {
  return new Promise((resolve, reject) => {
    const result = spawn('python', ['../python/openAI.py', gpt_q]);

    let decodedData = '';

    result.stdout.on('data', function (data) {
        decodedData = iconv.decode(data, 'utf-8');
        console.log("suc",decodedData);
        resolve(decodedData); // 값이 들어오면 보내기
    });

    result.stderr.on('data', function (data) {
        decodedData = iconv.decode(data, 'utf-8');
        console.log("error",decodedData);
        reject(decodedData); // 에러 발생
    });
  });
};

app.post('/gpt', (req, res) => {
  const gpt_q = req.body.query;
  console.log(gpt_q);

  if (gpt_q != null) {
    test_gpt(gpt_q)
      .then((gpt_answer) => {
          console.log('Success gpt');
          res.status(200).send(gpt_answer);                
      })
      .catch((error) => {
          console.error('Error:', error);
          res.send('Server error');
      });
  } else {
      res.status(400).send('Bad request');
  }
});

app.post('/loadRoom', async (req, res) => {
  const memberId = req.body.memberId;
  const roomId = req.body.roomId;

  const member = await findMember(memberId);
  const room = await findChat(roomId);

  // let temp = [];
  let inviteMember = member.friends;
  let test = [];
  
  if(member.friends != null){
    for(var i=0 ; i<member.friends.length ; i++){
      test[i] = member.friends[i].id;
    }
  }

  for(var i=0 ; i<room.id.length ; i++){
    if(test.indexOf(room.id[i], 0) > 0){
      inviteMember.splice(i,1); 
    }
    // temp = temp.id.filter(item => item !== room.id[i]);
  }

  res.json({member: member, room: room, inviteMember:inviteMember});
});


app.post('/joinRoom', async (req, res) => {
  //body 값 
  const memberId = req.body.memberId;
  const checkId = req.body.checkId;
  
  //멤버 정보 가져옴
  const member = await findMember(memberId);

  // db 넣을 값 세팅
  const sender = "System";
  const content = `[${member.name}]님이 채팅방을 만들었습니다.`;
  const currentDate = new Date();

  const roomId = await joinChat(memberId, checkId, sender, content, currentDate);

  //정보 업데이트 
  const update_member = await findMember(memberId);
  const room = await findChat(roomId);

  res.json({member: update_member, room: room, roomId: roomId});
});




app.post('/login', async (req, res) => {
  const memberId = req.body.memberId;
  const member = await findMember(memberId);

  console.log(member);

  res.json({member: member});
});

app.post('/friendAdd', async (req, res) => {
  const memberId = await req.body.memberId;
  const friendId = await req.body.friendId;

  const member = await findMember(memberId);
  const friend = await findMember(friendId);

  var flag = 0;
  if(member.friends != null){
    for(var i=0 ; i<member.friends.length ; i++){
        console.log(`memb ${member.friends[i].id}   fri ${friendId}`);
        if(member.friends[i].id == friendId){
            console.log("flag");
            flag = 1;
        }
    }
  }

  // 사용자 없는 경우 
  if(friend != null && flag == 0){
      console.log("있음");
      await friendAdd(memberId, friend.id, friend.name);
      const update_member = await findMember(memberId);
      console.log("resssssss", update_member);
      res.json(update_member);
  }
  //중복인 경우
  else if(flag == 1){
      console.log("중복");
      io.to(roomId).emit('friendFail', 'duplication');
  }
  else{
      console.log("없음");
      io.to(roomId).emit('friendFail', 'fail');
  }
});


app.post('/friendSub', async (req, res) => {
  const memberId = await req.body.memberId;
  const friendId = await req.body.friendId;

  await friendSub(memberId, friendId);

  const member = await findMember(memberId);
  res.json(member);
});


app.post('/friendChat', async (req, res) => {
  //db 내용 세팅 
  const sender = "System";
  const content = "채팅방이 생성되었습니다.";
  const currentDate = new Date();

  const memberId = await req.body.memberId;
  const friendId = await req.body.friendId;

  const roomId = await friendChat(memberId, friendId, sender, content, currentDate);
  const room = await findChat(roomId);

  const member = await findMember(memberId);
  res.json({member:member, room:room});
});

// socket.on('friendChat', async ({id, friendId}) => {
//   // 현재 시간을 나타내는 Date 객체 생성
//   const currentDate = new Date();

//   const roomId = await friendChat(id, friendId, currentDate);

//   // 채팅방이 없으면 생성
//   if (!chatRooms[roomId]) {
//       chatRooms[roomId] = [];
//   }

//   socket.join(roomId);

//   // 해당 채팅방에 현재 유저 입장 메시지 전송
//   io.to(roomId).emit('friendChat', roomId, await findChat(roomId), await findMember(id));
// });
