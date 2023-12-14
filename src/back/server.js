const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

const app = express();
const port = 4000;

const User = mongoose.model('collection',{
    id: String,
    pwd: String
});


app.use(cookieParser());
app.use(express.json()); // 수정: 함수 호출
app.use(express.urlencoded({extended: false}))
app.use(cors())


app.post('/signIn',async(req,res) => {  // 로그인 데이터 불러오기

  try{
    const {id,pwd} = req.body;

    console.log(req.body.id)
    console.log(req.body.pwd)

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb://127.0.0.1:16045";

    // 데이터베이스와 컬렉션 이름
    const dbName = 'whinchat';
    const collectionName = 'member';

    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
 
    client.connect();
    console.log("connected")

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const data = await collection.findOne({ id: id });
    console.log('Fetched data:', data);
    
    if(data){
        if(data.pwd===pwd){
            res.cookie('id',data.id,{ maxAge: 900000, httpOnly: true });
            res.json({messege: "Login suceessful!", cheked: true});
            console.log("cookie : " + req.cookies.id);
        }else{
            res.json({messege: "ID or PASSWORD error", cheked: false});
        }
    }else{
        res.json({messege: "ID or PASSWORD error", cheked: false});
    }
    client.close();
    console.log('Connection closed');
  }catch(err){
    console.log("req : " + req.body)
    console.error(err);
  }
    
} );

app.post('/signUp', async (req, res) => { // 회원가입 데이터 불러오기
  const { id, pwd } = req.body;

  console.log(req.body.id)
  console.log(req.body.pwd)

  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb://127.0.0.1:16045";

  const dbName = 'whinchat';  // Corrected typo here
  const collectionName = 'member';

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  client.connect();
  console.log("connected")

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const distinctId = await collection.findOne({ id });

  if (distinctId) {
    return res.json({ success: false, message: '이미 존재하는 ID입니다.' });
  } else {
    await collection.insertOne({ id, pwd });
    res.json({ success: true, message: '회원가입 성공' });
  }
  client.close();
  console.log('연결 해제');
});

app.post('/profile',async(req,res) => {  // 프로필 변경

  try{
    const {name,pr} = req.body;

    console.log(req.body.name)
    console.log(req.body.pr)

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb://127.0.0.1:16045";

    // 데이터베이스와 컬렉션 이름
    const dbName = 'whinchat';
    const collectionName = 'member';

    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    if(req.cookies.id!=null){
      
      client.connect();
      console.log("connected")

      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      const data = await collection.updateOne(
        { id: req.cookies.id },
        { 
          $set: { 
            name: name,
            pr : pr
       }}
      )
  
      console.log('Fetched data:', data);
      
      if(data){ 
        res.json({messege: "프로필 변경 성공", cheked: true});
      }else{
        res.json({messege: "프로필 변경 실패", cheked: false});
      }
      client.close();
      console.log('Connection closed');
    }else{
      console.log("쿠키 없음");
    }
    
  }catch(err){
    console.log("req : " + req.body)
    console.error(err);
  }
    
});

app.post('/logout',async(req,res) => {  // 프로필 변경

  try{

    const out = res.clearCookie("id");

    if(out){ 
      res.json({messege: "로그아웃 완료", cheked: true});
      console.log("cookie : " + req.body.id)
    }else{
      res.json({messege: "로그아웃 실패", cheked: false});
    }

  }catch(err){
    console.log("req : " + req.body)
    console.error(err);
  }
    
});

app.listen(port,()=>(
    console.log("연결되었습니다.")
))