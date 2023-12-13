import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './CSS/App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import NavLayout from './pages/NavLayout'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import SessionRoom from './pages/SessionRoom';
import SessionBrowser from './pages/SessionBrowser';


function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch("/api/checksession").then((response) => {
      if (response.ok) {
        response.json().then((user) => {setUser(user); setCurrentId(user.id)});
      }
    });
  }, []);



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavLayout user={user} setUser={setUser}/>}>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="sessionbrowser" element={<SessionBrowser user={user}/>} />
        <Route path="login" element={<LogIn user={user} setUser={setUser}/>} />
        <Route path="signup" element={<SignUp user={user}/>} />
        <Route path="sessionroom" element={<SessionRoom user={user}/>} />
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
