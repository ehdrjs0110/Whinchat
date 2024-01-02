const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 4000;

const User = mongoose.model('collection',{
    id: String,
    pwd: String
});


app.use(express.json()); // 수정: 함수 호출
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post('/call',async(req,res) => {  // 디비 저장 값 가져오기

  try{
    const {id} = req.body;

    console.log(req.body.id)

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
      res.json({name: data.name, pr: data.pr, img: data.filename , cheked: true});  
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
            res.json({messege: "Login suceessful!", cheked: true});
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
    var {name,pr,id} = req.body;

    console.log(req.body.name)
    console.log(req.body.pr)
    console.log(req.body.id)

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

    if(id!=null){
      
      client.connect();
      console.log("connected")

      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      const profileData = await collection.findOne({ id });

      if(name==""){
        name = profileData.name;
      }else if(pr==""){
        pr = profileData.pr;
      }
        const data = await collection.updateOne(
          { id: id },
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

//사진 업로드
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "/home/ubuntu/project/whinchat/public/proimg")
  },
  filename: function(req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  },
  filefilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("PNG, JPG만 업로드하세요"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

const upload = multer({
  storage: storage
  
});

// app.get("/upload", function (req, res) {
//   res.render("Profile.jsx");
// });

// app.get("/home/ubuntu/project/whinchat/public/proimg/:imgName", function(req, res){
//   res.sendFile(__dirname + "/home/ubuntu/project/whinchat/public/proimg/" + req.params.imgName);
// });

app.post('/upload', upload.single('file'), async (req, res) => {
  // console.log(req.body)
  console.log(req.file)
  const updateData = (
    { $set: {
      filename : req.file.filename }}
  );
  const filterCriteria = { id: 'user' };
  console.log("쿠키 값이 넘어와? : "+req.cookie);
  //DB
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

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const ExistingData = await collection.findOne(filterCriteria);
  
  // console.log(ExistingData);
  // console.log(ExistingData.filename);

  if(ExistingData && ExistingData.filename){
    const fs = require('fs');
    const fpath =  `/home/ubuntu/project/whinchat/public/proimg/${ExistingData.filename}`;
    // console.log(ExistingData.filename);
    if(fs.existsSync(fpath)){   // 주어진 파일 경로(path)에 해당하는 파일 또는 디렉토리가 존재하는지 확인
      fs.unlinkSync(fpath);   // 주어진 파일 경로(path)에 해당하는 파일을 동기적으로 삭제
      console.log('기존 이미지 파일 삭제');
    }else{
      console.log("이미지 삭제 실패");
    }
    await collection.updateOne(filterCriteria, updateData);
    console.log('이미지 업로드');
    res.send(req.file.filename);
  } else{
    await collection.updateOne(filterCriteria, updateData)
      .then(result => {
        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
        res.send(req.file.filename);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("서버 오류");
      });
  }
  
});

app.post('/logout',async(req,res) => {  // 프로필 변경

  try{

    if(req.body!=null){ 
      res.json({messege: "로그아웃 완료", cheked: true});
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