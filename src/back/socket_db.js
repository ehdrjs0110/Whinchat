


const { MongoClient, ServerApiVersion } = require('mongodb');
const { RemoteSocket } = require('socket.io');
const uri = "mongodb://127.0.0.1:16045";

// 데이터베이스와 컬렉션 이름
const dbName = 'whinchat';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

const { ObjectId } = require('mongodb');

//세팅 
const database = client.db(dbName);
const memberCollectionName = 'member';
const chatCollectionName = 'chat';
const memberCollection = database.collection(memberCollectionName);
const chatCollection = database.collection(chatCollectionName);

async function joinChat(id, checkId, sender, content, currentDate) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    console.log("connected")

    const insertId = [];
    insertId[0] = id;
    for(var i=1 ; i<=checkId.length ; i++){
      insertId[i] = checkId[i-1];
    }

    const result = await chatCollection.insertOne({
      'log':[
        {
          'sender':sender,
          'content':content,
          'time':currentDate
        }
      ],
      'id':[insertId],
      'headCount' : (1 + checkId.length)
    });

    //_id값 받아오기 
    const roomId = result.insertedId.toString();
    console.log('Inserted data:',roomId);
    const roomName = "그룹 채팅방";

    memberCollection.updateOne(
      { id:id },
      // { $push: { room: roomName } }
      { $push: { room : {"type":"group", "id": roomId, "name": roomName} }}
    )

    for(var i=0 ; i<checkId.length ; i++){
      memberCollection.updateOne(
        { id:checkId[i] },
        // { $push: { room: roomName } }
        { $push: { room : {"type":"group", "id": roomId, "name": roomName} }}
      )
    }

    return roomId;
  } catch (error) {
    console.error('insert 실패 !!!', error);
  }
}


async function updateChat(id, roomName, message, currentDate){
  await chatCollection.updateOne(
    { _id: new ObjectId(roomName)},
    { $push: { log:{sender: id, content: message, time: currentDate}} }
  )
}

async function leaveChat(id, roomId, currentDate){
  const text = `${id}님이 채팅방을 나갔습니다.`;
  memberCollection.updateOne(
    { id:id },
    { $pull: { room: {id:roomId } }}
  );

  //find로 roomId에 해당하는 거 가져옴
  const chat = await findChat(roomId);
  const headCount = parseInt(chat.headCount);

  //headCount 1일때
  if(headCount == 1){
    chatCollection.deleteOne({_id : new ObjectId(roomId)});
  }
  //headCount 1 이상일 때 
  else{
    chatCollection.updateOne(
      { _id: new ObjectId(roomId)},
      { $push: { log:{sender: "System", content: text, time: currentDate}},
      $set : {headCount: headCount - 1} }
    )
  }
}

async function findChat(roomName){
  const result = await chatCollection.findOne({_id : new ObjectId(roomName)});

  console.log('find chat >> ', result);
  return result;
}

async function findMember(id){
  const result = await memberCollection.findOne({id :id});

  console.log('find member >> ', result);
  return result;
}

async function friendAdd(id, friendId, friendName){
  console.log("db  ", id, friendId);
  await memberCollection.updateOne(
    { id: id },
    { $push: { friends : {"id": friendId, "name": friendName } }}
    )
}
  
async function friendSub(id, friendId){
  console.log("db  ", id, friendId);
  await memberCollection.updateOne(
    { id:id },
    { $pull: { friends: {id:friendId } }}
  );
}

async function friendChat(id, friendId, sender, content, currentDate){
  //name정보 가져오기
  const me = await findMember(id);
  const friend = await findMember(friendId);

  if(me.room != null){
    for(var i=0 ; i<me.room.length ; i++){
      if(me.room[i].type == "one-on-one" && me.room[i].friendId == friendId){
        return me.room[i].id;
      }
    }
  }
  
  const result = await chatCollection.insertOne({
    'log':[
      {
      'sender':sender,
      'content':content,
      'time':currentDate
      }
    ],
    'id':[id, friendId],
    'headCount':2
  });

  //_id값 받아오기 
  const roomId = result.insertedId.toString();
  console.log('Inserted data:',roomId);

  memberCollection.updateOne(
    { id:id },
    { $push: { room : {"type":"one-on-one", "id": roomId, "name": friend.name, "friendId":friend.id } }}
  )

  memberCollection.updateOne(
    { id:friendId },
    { $push: { room : {"type":"one-on-one", "id": roomId, "name": me.name, "friendId":me.id  } }}
  )

  return roomId;
}

async function inviteMember(id, roomId, roomName){
  console.log('gg');
  memberCollection.updateOne(
    { id: id },
    { $push: { room : {"id": roomId, "name": roomName } }}
  )
  chatCollection.updateOne(
    { _id: new ObjectId(roomId)},
    { $push: { id:id} }
  )

}

async function inviteChat(roomId, text, date){
  //find로 roomName에 해당하는 거 가져옴
  const chat = await findChat(roomId);
  const headCount = parseInt(chat.headCount);

  chatCollection.updateOne(
    { _id: new ObjectId(roomId)},
    { $push: { sender: "System", content: text, time: date} }
  )

  chatCollection.updateOne(
    { _id : new ObjectId(roomId) },
    { $set : {headCount: headCount + 1}}
  )

}



module.exports = {joinChat, updateChat, leaveChat, 
            findChat, findMember, friendAdd, friendSub,
             inviteMember, inviteChat, friendChat};