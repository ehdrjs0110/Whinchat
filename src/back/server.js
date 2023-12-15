const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const port = 4000;

const User = mongoose.model('collection',{
    id: String,
    pwd: String
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";

// 데이터베이스와 컬렉션 이름
const dbName = 'wodysl';
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

app.use(express.json()); // 수정: 함수 호출
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post('/signIn',async(req,res) => {  // 로그인 데이터 불러오기

  try{
    const {id,pwd} = req.body;

    console.log(req.body.id)
    console.log(req.body.pwd)
 
    client.connect();
    console.log("connected")


    const data = await collection.findOne({ id: id });
    console.log('Fetched data:', data);
    
    if(data){
        if(data.pwd===pwd){
            res.json({messege: "Login suceessful! 김지영!!", cheked: true});
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
  client.connect();
  console.log("connected");

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

app.listen(port,()=>(
    console.log("연결되었습니다.")
))