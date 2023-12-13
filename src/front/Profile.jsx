import React, { useState } from "react";

function Profile() {
  const [State, setState] = useState({
    name: "",
    pr: "",
  });

  const handle = (e) => {
    setState({
      ...State,
      [e.target.name]: e.target.value,
    });
  };

  const submitId = () => {
    const post = {
      name: State.name,
      pr: State.pr,
    };

    fetch("http://localhost:4000/Profile", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.cheked == true)
        {
          alert("프로필 변경 성공")

        } else{
          alert("프로필 변경 실패")
        }      
        setState({
          ...State,
          message: json.message,
        });
      })
      .catch((error) => {
        setState({
          ...State,
          message: error.message,
        });
      });
  };

return (

  <div className="forms-container">
      <div className="signin-signup">
          <form action="" className="sign-in-form" >
              <h2 className="title">profile change</h2>
              <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input type="text" id="name" name="name" placeholder="이름" required onChange={handle}/>
              </div>
              <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <textarea id="pr" name="pr" placeholder="소개" onChange={handle}></textarea>
              </div>
              <input type="button" value="수정" className="btn solid" onClick={submitId}/>   
          </form>
      </div>
  </div>
); 
}

export default Profile;