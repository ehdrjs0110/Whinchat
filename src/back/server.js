const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3001;

const User = mongoose.model('user',{
    id: String,
    pwd: String
});

app.use(express.json()); // 수정: 함수 호출
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post('/signIn',async(req,res) => {
    const {id,pwd} = req.body;

    console.log(req.body.id)
    console.log(req.body.pwd)

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb://127.0.0.1:27017";

    const dbName = 'test1';
    const collectionName = 'user';

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
            res.json({messege: "Login suceessful! 김지영!!", cheked: true});
        }else{
            res.json({messege: "ID or PASSWORD error", cheked: false});
        }
    }else{
        res.json({messege: "ID or PASSWORD error", cheked: false});
    }
    
    client.close();
    console.log('Connection closed');
} );

app.post('/signUp', async (req, res) => {
  const { id, pwd } = req.body;

  console.log(req.body.id)
  console.log(req.body.pwd)

  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb://127.0.0.1:27017";

  const dbName = 'test1';  // Corrected typo here
  const collectionName = 'user';

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

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./C:/Users/bule9/Whinchat/test/wodysl_react_test/public/proimg")
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

app.get("/upload", function (req, res) {
  res.render("Profile.jsx");
});

app.get("/C:/Users/bule9/Whinchat/test/wodysl_react_test/public/proimg/:imgName", function(req, res){
  res.sendFile(__dirname + "/C:/Users/bule9/Whinchat/test/wodysl_react_test/public/proimg/" + req.params.imgName);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  // console.log(req.body)
  console.log(req.file)
  const updateData = (
    { $set: {
      filename : req.file.filename }}
  );
  const filterCriteria = { id: 'admin' };
  
  //DB
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb://127.0.0.1:27017";

  const dbName = 'test1';  // Corrected typo here
  const collectionName = 'user';

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
    const fpath =  `C:/Users/bule9/Whinchat/test/wodysl_react_test/public/proimg/${ExistingData.filename}`;
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

app.post('/profile',async(req,res) => {  // 프로필 변경

  try{
    const {name,pr} = req.body;

    console.log(req.body.name)
    console.log(req.body.pr)

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb://127.0.0.1:27017";

    // 데이터베이스와 컬렉션 이름
    const dbName = 'test1';
    const collectionName = 'user';

    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    if(req.body.id!=null){
      
      client.connect();
      console.log("connected")

      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      const data = await collection.updateOne(
        { id: 'req.body.id' },
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

app.listen(port,()=>(
    console.log("연결되었습니다.")
));
