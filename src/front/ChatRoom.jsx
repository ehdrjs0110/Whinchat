import React from "react"
import { useLocation, useNavigate } from "react-router-dom";

function ChatRoom() {
    const location=useLocation()
    return (
        <div className="mainChat">
            <h1>Hello and welcome to the chat</h1>
        </div>
    )
}

export default ChatRoom;