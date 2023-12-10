import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './CSS/App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import NavLayout from './pages/NavLayout'
import Home from './pages/Home'
import ChatBrowser from './pages/ChatBrowser'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom';


function App() {
  const [user, setUser] = useState("me")


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavLayout />}>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="chatbrowser" element={<ChatBrowser user={user}/>} />
        <Route path="login" element={<LogIn user={user} setUser={setUser}/>} />
        <Route path="signup" element={<SignUp user={user}/>} />
        <Route path="chatroom" element={<ChatRoom user={user}/>} />
      </Route>
    )
  )

  // return (
  //   <div className='bg-fit-screen'>
  //     <RouterProvider router={router} />
  //   </div>
  // )



  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
