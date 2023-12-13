import React from "react"
import { useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';

function ChatRoom() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    let idle = cookies.get('id');
    
    const logout = () => {

        fetch("http://3.36.66.72:4000/Logout", {
        method: "post"
        })
      .then((res) => res.json())
      .then((json) => {
        if (json.cheked == true)
        {
            alert("로그아웃 되셨습니다.");
            cookies.remove('id');
            navigate('/Sign');
        } else{
          alert("로그아웃 실패했습니다.")
        }      
      })
      .catch((error) => {
        console.log(error);
      });
    }

    return (
        <div className="mainChat">
            <h1>Hello and welcome to the chat</h1>
            <h2>{idle}</h2>
            <button onClick={logout}>로그아웃</button>
        </div>
    )
}

export default ChatRoom;