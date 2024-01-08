

// import mongoDB from './socket_db.js';
const {joinChat, updateChat, leaveChat, findChat, findMember, friendAdd, inviteChat, inviteMember, friendSub, friendChat} = require('./socket_db.js');
// import * as socketDB from './socket_db.js';
// import * as gpt from './nodepy.js';

//express
const express = require('express');
const app = express();
const port = 8088;
const server = app.listen(port, function(){
    console.log('Listening on '+ port)
});

//socket
const SocketIO = require('socket.io');
const io = SocketIO(server, {path: '/socket.io'});

// 채팅방 목록
const chatRooms = {};

io.on('connection', function(socket){
    // const mId = socket.handshake.query.memberId;
    console.log(socket.id, ' connected...');

    // 채팅방 내용 불러오기 
    socket.on('loadRoom', async (roomId) => {
        console.log("load");
        // 채팅방이 없으면 생성
        if (!chatRooms[roomId]) {
            chatRooms[roomId] = [];
        }

        socket.join(roomId);

        io.to(roomId).emit('load', "성공");
    });

    // 채팅방 입장
    socket.on('joinRoom', async (id) => {
        console.log("joinnnn");
        //멤버 정보 가져옴
        const member = await findMember(id);

        // db 넣을 값 세팅
        const sender = "System";
        const content = `[${member.name}]님이 채팅방을 만들었습니다.`;
        const currentDate = new Date();

        const {roomId, roomName} = await joinChat(id, sender, content, currentDate);

        //room정보 업데이트 
        const update_member = await findMember(id);

        // 채팅방이 없으면 생성
        if (!chatRooms[roomId]) {
            chatRooms[roomId] = [];
        }

        socket.join(roomId);

        const room = await findChat(roomId);
        const flag = [];

        // for(var i=0 ; i<member.friends.length ; i++){
        //     if(room.id.indexOf(member.friends[i].id) > 0){
        //         console.log(member.friends[i].id,"  flag");
        //         flag[i] = 1;
        //     }

        // }
        // 해당 채팅방에 현재 유저 입장 메시지 전송
        io.to(roomId).emit('join', { user: sender, text: content,time: currentDate, room: room, roomId: roomId ,roomName: roomName, member : update_member, flag: flag});
    });


    // socket.on('login', async (id) => {
    //     // 채팅방이 없으면 생성
    //     if (!chatRooms[id]) {
    //         chatRooms[id] = [];
    //     }

    //     socket.join(id);

    //     const member = await findMember(id);

    //     io.to(id).emit('member', member);
    // });

    //채팅 
    socket.on('sendMessage', async function({id, roomId, message}){
        // 현재 시간을 나타내는 Date 객체 생성
        const currentDate = new Date();

        await updateChat(id, roomId, message, currentDate);

        const room = await findChat(roomId);
        const member = await findMember(id);
        
        console.log("[",roomId, "] ", id, ': ', message);
        // io.to(roomId).emit('message', room);
        io.to(roomId).emit('message', {room:room, member: member});
    });

    //나가기
    socket.on('leaveRoom', async ({roomId, id}) => {
        // 현재 시간을 나타내는 Date 객체 생성
        const currentDate = new Date();

        await leaveChat(id, roomId, currentDate);

        // const room = await findChat(roomId);
        const member = await findMember(id);

        //나감 전송 
        io.to(roomId).emit('message', {room:null, member: member});
    });

    //member정보 불러오기
    // socket.on('member', async (id) => {
    //     const member = await findMember(id);
    //     io.emit('member', member );
    // });
    
    //친구 추가
    // socket.on('friendAdd', async ({id, friendId, roomId}) => {
    //     const member = await findMember(id);
    //     const friend = await findMember(friendId);

    //     var flag = 0;
    //     if(member.friends != null){
    //         for(var i=0 ; i<member.friends.length ; i++){
    //             console.log(`memb ${member.friends[i].id}   fri ${friendId}`);
    //             if(member.friends[i].id == friendId){
    //                 console.log("flag");
    //                 flag = 1;
    //             }
    //         }
    //     }

    //     //사용자 없는 경우 
    //     if(friend != null && flag == 0){
    //         console.log("있음");
    //         await friendAdd(id, friend.id, friend.name);
    //         io.to(roomId).emit('friendAdd', friend.id, friend.name);
    //     }
    //     //중복인 경우
    //     else if(flag == 1){
    //         console.log("중복");
    //         io.to(roomId).emit('friendFail', 'duplication');
    //     }
    //     else{
    //         console.log("없음");
    //         io.to(roomId).emit('friendFail', 'fail');
    //     }
    // });

    socket.on('friendSub', async ({id, friendId}) => {
        await friendSub(id, friendId);
    });

    socket.on('friendChat', async (roomId) => {
        // 채팅방이 없으면 생성
        if (!chatRooms[roomId]) {
            chatRooms[roomId] = [];
        }

        socket.join(roomId);

        // 해당 채팅방에 현재 유저 입장 메시지 전송
        // io.to(roomId).emit('friendChat', roomId, await findChat(roomId), await findMember(id));
    });

    socket.on('invite', async ({idList, id, roomId, roomName}) => {
        const member = await findMember(id);

        let str = `${roomName}   ${member.name}님이 `;

        // for(var i=0 ; i<member.friends.length ; i++){
        //     if(flag[i] == 1){
        //         await inviteMember(member.friends[i].id, roomId, roomName);
        //         str += `${member.friends[i].name}님 `;
        //     }
        // }
        for(var i=0 ; i<idList.length ; i++){
            const friend = await findMember(idList[i]);
            await inviteMember(idList[i], roomId, roomName);
            str += `${friend.name}님 `;
        }
        str += "을 초대했습니다.";

        // 현재 시간을 나타내는 Date 객체 생성
        const currentDate = new Date();

        await inviteChat(roomId, str, currentDate);

        //나감 전송 
        io.to(roomId).emit('message', { user: 'System', text: str, time:currentDate });
    });

    //연결 끊기
    socket.on('disconnect', function(){
        console.log("8080포트 연결 끊음");
    });
});