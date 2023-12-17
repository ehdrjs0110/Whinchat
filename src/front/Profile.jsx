import React, { useState } from 'react';
import axios from 'axios';

function Profile() {
    const URL = "http://localhost:3001/upload";

    const [file, setFile] = useState("");
    const upload = () => {
        const formData = new FormData()
        formData.append('file', file)
        axios.post("http://localhost:3001/upload", formData)
        .then(res => {
            
        })
        .catch(er => console.log(er))
    }
    const [uploadedImg, setUploadedImg] = useState({
        fileName: "",
        fillPath: ""
    });
    const onChange = e => {
        setFile(e.target.files[0]);
    };
    const onSubmit = e => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("img", file); 
      axios
        .post("/upload", formData)
        .then(res => {
          const { fileName } = res.data;
          console.log(fileName);
          setUploadedImg({ fileName, filePath: `${URL}/img/${fileName}` });
          alert("The file is successfully uploaded");
        })
        .catch(err => {
          console.error(err);
        });
      };

  
  return (
    <>
      <form onSubmit={onSubmit}>
        {uploadedImg ? (
          <>
            <img src={uploadedImg.filePath} alt="" />
            <h3>{uploadedImg.fileName}</h3>
          </>
        ) : (
          ""
        )}
        <input type="file"  onChange={(e) => setFile(e.target.files[0])} />
        <button type="button" onClick={upload}>Upload</button>
      </form>
    </>
  );
}

export default Profile;