import { React, useState, useEffect } from 'react'
// import { io } from 'socket.io-client';
import ChatBox from '../components/ChatBox'

let socket

function ChatRoom({user}) {
    const [roomNum, setRoomNum] = useState("1")
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [connected, setConnected] = useState(false)

    // useEffect(() => {
    //     socket = io('ws://localhost:5555');
    //     setConnected(true)
    //     socket.emit('room-change', "1")
    //     return () => {
    //       socket.off('disconnected', (msg) => {
    //           console.log(msg);
    //         });
    //     }
    //   }, []);
    
    //   useEffect(() => {
    //     console.log("use effect")
    //     if (connected){
    //         console.log('the thing!')
    //         socket.on('server-message', (serverMessage)=>{
    //             addMessage(serverMessage)
    //         })
    //       }
    //         return () => {
    //         console.log('clean-up!')
    //         socket.removeListener('server-message', (msg) => {
    //             console.log(msg);
    //         });
    //         }
    //   }, [messages, connected, roomNum]);
    
    
      function sendMessage(sender, message, room){
        console.log(message)
        // socket.emit('client-message', sender, message, room)
      }

    function addMessage(message){
        console.log(message)
        // console.log(messages)
        setMessages([...messages, {'sender': message.sender, 'message': message.message}])
      }


  return (
      <>
          <div>
              <h1>Chat Room</h1>
          </div>
          <div>
              <ChatBox messages={messages} user={user} addMessage={addMessage} socket={socket} />
              {/* sockets */}
              <form onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(user, newMessage, roomNum)
                  setNewMessage("")
              }}>
                  <label>Message:</label>
                  <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
              </form>
          </div>
      </>


  )
}

export default ChatRoom